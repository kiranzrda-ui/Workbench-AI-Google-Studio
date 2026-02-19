using Microsoft.EntityFrameworkCore;
using Workbench.Api.Contracts;
using Workbench.Api.Domain;
using Workbench.Api.Persistence;

namespace Workbench.Api.Services;

public sealed class ModelService(WorkbenchDbContext dbContext) : IModelService
{
    public async Task<IReadOnlyCollection<ModelSummaryDto>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await dbContext.Models
            .AsNoTracking()
            .OrderByDescending(x => x.CreatedAtUtc)
            .Select(x => new ModelSummaryDto(x.Id, x.Name, x.Owner, x.MonitoringStatus, x.CreatedAtUtc))
            .ToListAsync(cancellationToken);
    }

    public async Task<ModelSummaryDto> CreateAsync(CreateModelRequestDto request, CancellationToken cancellationToken)
    {
        var entity = new ModelEntity
        {
            Name = request.Name.Trim(),
            Owner = request.Owner.Trim(),
            MonitoringStatus = "Healthy"
        };

        dbContext.Models.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);

        return new ModelSummaryDto(entity.Id, entity.Name, entity.Owner, entity.MonitoringStatus, entity.CreatedAtUtc);
    }
}
