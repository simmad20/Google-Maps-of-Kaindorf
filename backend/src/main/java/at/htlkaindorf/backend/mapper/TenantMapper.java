package at.htlkaindorf.backend.mapper;

import at.htlkaindorf.backend.dtos.TenantDTO;
import at.htlkaindorf.backend.models.documents.Tenant;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = MongoIdMapper.class)
public interface TenantMapper {
    TenantDTO toDto(Tenant tenant);

    Tenant toEntity(TenantDTO tenantDTO);
}
