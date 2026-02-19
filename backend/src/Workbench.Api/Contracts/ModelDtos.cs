namespace Workbench.Api.Contracts;

public sealed record ModelSummaryDto(Guid Id, string Name, string Owner, string MonitoringStatus, DateTime CreatedAtUtc);
public sealed record CreateModelRequestDto(string Name, string Owner);
