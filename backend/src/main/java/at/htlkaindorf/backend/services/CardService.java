package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.auth.AuthContext;
import at.htlkaindorf.backend.dtos.CardDTO;
import at.htlkaindorf.backend.mapper.CardMapper;
import at.htlkaindorf.backend.models.documents.Card;
import at.htlkaindorf.backend.repositories.CardRepository;
import com.mongodb.client.gridfs.model.GridFSFile;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CardService {
    private final CardRepository cardRepository;
    private final CardMapper cardMapper;
    private final GridFsTemplate gridFsTemplate;
    private final GridFsOperations gridFsOperations;
    private final AuthContext authContext;

    public List<CardDTO> getAllCards() {
        return cardRepository.findAllByTenantId(authContext.getTenantObjectId())
                .stream().map(cardMapper::toDTO)
                .collect(Collectors.toList());
    }

    public CardDTO createCard(String title, MultipartFile image)
            throws IOException {
        int[] dims = readDimensions(image);
        ObjectId fid = storeInGridFs(image);
        Card card = new Card();
        card.setTenantId(authContext.getTenantObjectId());
        card.setTitle(title);
        card.setTenantId(authContext.getTenantObjectId());
        card.setImageFileId(fid.toHexString());
        card.setImageWidth(dims[0]);
        card.setImageHeight(dims[1]);
        return cardMapper.toDTO(cardRepository.save(card));
    }

    /**
     * Replace image only — old GridFS file is deleted first
     */
    public CardDTO replaceImage(ObjectId cardId, MultipartFile image) throws IOException {
        Card card = cardRepository.findCardByIdAndTenantId(cardId, authContext.getTenantObjectId())
                .orElseThrow(() -> new IllegalArgumentException("Card not found: " + cardId));
        if (card.getImageFileId() != null) deleteGridFsFile(card.getImageFileId());
        int[] dims = readDimensions(image);
        card.setImageFileId(storeInGridFs(image).toHexString());
        card.setImageWidth(dims[0]);
        card.setImageHeight(dims[1]);
        return cardMapper.toDTO(cardRepository.save(card));
    }

    /**
     * Delete card + its image from GridFS
     */
    public void deleteCard(ObjectId cardId) {
        Card card = cardRepository.findCardByIdAndTenantId(cardId, authContext.getTenantObjectId())
                .orElseThrow(() -> new IllegalArgumentException("Card not found: " + cardId));
        if (card.getImageFileId() != null) deleteGridFsFile(card.getImageFileId());
        cardRepository.deleteById(cardId);
    }

    /**
     * Stream raw image bytes
     */
    public ImageResource getImage(ObjectId cardId) throws IOException {
        Card card = cardRepository.findCardByIdAndTenantId(cardId, authContext.getTenantObjectId())
                .orElseThrow(() -> new IllegalArgumentException("Card not found: " + cardId));
        if (card.getImageFileId() == null)
            throw new IllegalStateException("Card has no image: " + cardId);

        GridFSFile file = gridFsTemplate.findOne(
                new Query(Criteria.where("_id").is(new ObjectId(card.getImageFileId()))));
        if (file == null) throw new IllegalStateException("GridFS file missing");

        String ct = (file.getMetadata() != null
                && file.getMetadata().get("_contentType") != null)
                ? file.getMetadata().get("_contentType").toString()
                : "image/png";

        return new ImageResource(ct, gridFsOperations.getResource(file).getInputStream());
    }


    private int[] readDimensions(MultipartFile f) throws IOException {
        try (InputStream is = f.getInputStream()) {
            BufferedImage img = ImageIO.read(is);
            if (img == null) throw new IOException(
                    "Cannot decode image — unsupported format or corrupt file");
            return new int[]{img.getWidth(), img.getHeight()};
        }
    }

    private ObjectId storeInGridFs(MultipartFile f) throws IOException {
        return gridFsTemplate.store(
                f.getInputStream(),
                f.getOriginalFilename() != null
                        ? f.getOriginalFilename().replaceAll("[^a-zA-Z0-9._-]", "_")
                        : "upload.png",
                f.getContentType());
    }

    private void deleteGridFsFile(String fileId) {
        gridFsTemplate.delete(
                new Query(Criteria.where("_id").is(new ObjectId(fileId))));
    }

    public static class ImageResource {
        public final String contentType;
        public final InputStream stream;

        ImageResource(String ct, InputStream s) {
            contentType = ct;
            stream = s;
        }
    }
}
