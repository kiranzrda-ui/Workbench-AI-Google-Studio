namespace Workbench.Api.Domain;

public sealed class ApprovalRequestEntity
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public Guid ModelId { get; set; }
    public string Requester { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending";
    public DateTime RequestedAtUtc { get; init; } = DateTime.UtcNow;
}
