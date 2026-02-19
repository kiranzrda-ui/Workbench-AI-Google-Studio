namespace Workbench.Api.Contracts;

public sealed record ChatMessageDto(string Role, string Content, DateTime TimestampUtc);
public sealed record ChatRequestDto(string Persona, IReadOnlyCollection<ChatMessageDto> Messages);
public sealed record ChatResponseDto(string Reply, IReadOnlyCollection<string> ToolCalls);
