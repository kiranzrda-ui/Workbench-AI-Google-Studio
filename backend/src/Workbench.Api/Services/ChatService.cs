using Workbench.Api.Contracts;

namespace Workbench.Api.Services;

public sealed class ChatService : IChatService
{
    public Task<ChatResponseDto> RespondAsync(ChatRequestDto request, CancellationToken cancellationToken)
    {
        var lastPrompt = request.Messages.LastOrDefault()?.Content ?? "";
        var reply = $"[{request.Persona}] Acknowledged: {lastPrompt}";
        var result = new ChatResponseDto(reply, ["audit.log", "governance.policy-check"]);
        return Task.FromResult(result);
    }
}
