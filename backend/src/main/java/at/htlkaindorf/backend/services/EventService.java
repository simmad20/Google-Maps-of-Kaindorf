package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.dtos.EventCreateDTO;
import at.htlkaindorf.backend.dtos.EventDTO;
import at.htlkaindorf.backend.exceptions.NotFoundException;
import at.htlkaindorf.backend.mapper.EventMapper;
import at.htlkaindorf.backend.models.documents.Event;
import at.htlkaindorf.backend.repositories.EventRepository;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final EventMapper eventMapper;

    public List<EventDTO> getAllEvents() {
        return eventRepository.findAll().stream().map(eventMapper::toDTO).toList();
    }

    public EventDTO findActiveEvent() {
        return eventMapper.toDTO(eventRepository.findEventByActiveIsTrue()
                .orElseThrow(() -> new NotFoundException("No active event found")));
    }

    public EventDTO createEvent(EventCreateDTO eventDTO) {
        Event event = eventMapper.createDTOtoEntity(eventDTO);
        return eventMapper.toDTO(eventRepository.save(event));
    }

    public EventDTO updateEvent(EventDTO eventDTO) {
        eventRepository.findById(new ObjectId(eventDTO.getId())).orElseThrow(() -> new NotFoundException("Object type with id " +
                eventDTO.getId() + " not found."));

        return eventMapper.toDTO(eventRepository.save(eventMapper.toEntity(eventDTO)));
    }

    @Transactional
    public EventDTO setActiveEvent(String eventId) {
        ObjectId activeId = new ObjectId(eventId);

        eventRepository.findAll().forEach(event -> {
            if (!event.getId().equals(activeId) && event.isActive()) {
                event.setActive(false);
                eventRepository.save(event);
            }
        });

        Event eventToActivate = eventRepository.findById(activeId)
                .orElseThrow(() -> new NotFoundException("Event nicht gefunden"));

        eventToActivate.setActive(true);
        eventRepository.save(eventToActivate);

        return eventMapper.toDTO(eventToActivate);
    }

}
