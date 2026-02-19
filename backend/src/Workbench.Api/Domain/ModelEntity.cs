namespace Workbench.Api.Domain;

public sealed class ModelEntity
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Owner { get; set; } = string.Empty;
    public string MonitoringStatus { get; set; } = "Healthy";
    public DateTime CreatedAtUtc { get; init; } = DateTime.UtcNow;
}
