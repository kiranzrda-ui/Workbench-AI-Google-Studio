using Microsoft.AspNetCore.Mvc;
using Workbench.Api.Contracts;
using Workbench.Api.Services;

namespace Workbench.Api.Controllers;

[ApiController]
[Route("api/chat")]
public sealed class ChatController(IChatService chatService) : ControllerBase
{
    [HttpPost("messages")]
    [ProducesResponseType(typeof(ChatResponseDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<ChatResponseDto>> PostMessage([FromBody] ChatRequestDto request, CancellationToken cancellationToken)
    {
        if (request.Messages.Count == 0)
        {
            return BadRequest("At least one message is required.");
        }

        var response = await chatService.RespondAsync(request, cancellationToken);
        return Ok(response);
    }
}
