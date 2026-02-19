using Microsoft.AspNetCore.Mvc;
using Workbench.Api.Contracts;
using Workbench.Api.Services;

namespace Workbench.Api.Controllers;

[ApiController]
[Route("api/models")]
public sealed class ModelsController(IModelService modelService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyCollection<ModelSummaryDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyCollection<ModelSummaryDto>>> GetAll(CancellationToken cancellationToken)
    {
        var items = await modelService.GetAllAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost]
    [ProducesResponseType(typeof(ModelSummaryDto), StatusCodes.Status201Created)]
    public async Task<ActionResult<ModelSummaryDto>> Create([FromBody] CreateModelRequestDto request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Owner))
        {
            return BadRequest("Name and owner are required.");
        }

        var created = await modelService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetAll), new { id = created.Id }, created);
    }
}
