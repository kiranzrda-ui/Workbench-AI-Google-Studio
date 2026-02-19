using Workbench.Api.Contracts;

namespace Workbench.Api.Services;

public interface IModelService
{
    Task<IReadOnlyCollection<ModelSummaryDto>> GetAllAsync(CancellationToken cancellationToken);
    Task<ModelSummaryDto> CreateAsync(CreateModelRequestDto request, CancellationToken cancellationToken);
}
