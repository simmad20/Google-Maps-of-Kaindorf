package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.auth.AuthContext;
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
    private final AuthContext authContext;

    public List<EventDTO> getAllEvents() {
        return eventRepository.findEventsByTenantId(authContext.getTenantObjectId()).stream().map(eventMapper::toDTO).toList();
    }

    public EventDTO findActiveEvent() {
        return eventMapper.toDTO(eventRepository.findEventByTenantIdAndActiveIsTrue(authContext.getTenantObjectId())
                .orElseThrow(() -> new NotFoundException("No active event found")));
    }

    public EventDTO createEvent(EventCreateDTO eventDTO) {
        Event event = eventMapper.createDTOtoEntity(eventDTO);
        event.setTenantId(authContext.getTenantObjectId());
        return eventMapper.toDTO(eventRepository.save(event));
    }

    public EventDTO updateEvent(EventDTO eventDTO) {
        Event existing = eventRepository.findByIdAndTenantId(
                new ObjectId(eventDTO.getId()), authContext.getTenantObjectId()
        ).orElseThrow(() -> new NotFoundException("Object type with id " + eventDTO.getId() + " not found."));

        eventMapper.updateEntityFromDTO(eventDTO, existing);
        return eventMapper.toDTO(eventRepository.save(existing));
    }

    @Transactional
    public EventDTO setActiveEvent(String eventId) {
        ObjectId activeId = new ObjectId(eventId);

        eventRepository.findEventsByTenantId(authContext.getTenantObjectId()).forEach(event -> {
            if (!event.getId().equals(activeId) && event.isActive()) {
                event.setActive(false);
                eventRepository.save(event);
            }
        });

        Event eventToActivate = eventRepository.findByIdAndTenantId(activeId, authContext.getTenantObjectId())
                .orElseThrow(() -> new NotFoundException("Event nicht gefunden"));

        eventToActivate.setActive(true);
        eventRepository.save(eventToActivate);

        return eventMapper.toDTO(eventToActivate);
    }

    @Transactional
    public void deleteEvent(String eventId) {
        Event event = eventRepository.findByIdAndTenantId(
                new ObjectId(eventId), authContext.getTenantObjectId()
        ).orElseThrow(() -> new NotFoundException("Event with id " + eventId + " not found."));

        eventRepository.delete(event);
    }

}
