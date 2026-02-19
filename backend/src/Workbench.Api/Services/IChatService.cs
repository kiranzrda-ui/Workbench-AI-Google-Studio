using Workbench.Api.Contracts;

namespace Workbench.Api.Services;

public interface IChatService
{
    Task<ChatResponseDto> RespondAsync(ChatRequestDto request, CancellationToken cancellationToken);
}
