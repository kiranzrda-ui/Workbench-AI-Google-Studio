using Microsoft.EntityFrameworkCore;
using Workbench.Api.Domain;

namespace Workbench.Api.Persistence;

public sealed class WorkbenchDbContext(DbContextOptions<WorkbenchDbContext> options) : DbContext(options)
{
    public DbSet<ModelEntity> Models => Set<ModelEntity>();
    public DbSet<ApprovalRequestEntity> ApprovalRequests => Set<ApprovalRequestEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ModelEntity>(entity =>
        {
            entity.ToTable("models");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.Name).HasColumnName("name").HasMaxLength(120).IsRequired();
            entity.Property(x => x.Owner).HasColumnName("owner").HasMaxLength(120).IsRequired();
            entity.Property(x => x.MonitoringStatus).HasColumnName("monitoring_status").HasMaxLength(32).IsRequired();
            entity.Property(x => x.CreatedAtUtc).HasColumnName("created_at_utc");
            entity.HasIndex(x => x.Name);
        });

        modelBuilder.Entity<ApprovalRequestEntity>(entity =>
        {
            entity.ToTable("approval_requests");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.Requester).HasColumnName("requester").HasMaxLength(120).IsRequired();
            entity.Property(x => x.Status).HasColumnName("status").HasMaxLength(40).IsRequired();
            entity.Property(x => x.ModelId).HasColumnName("model_id");
            entity.Property(x => x.RequestedAtUtc).HasColumnName("requested_at_utc");
            entity.HasIndex(x => new { x.ModelId, x.Status });
        });
    }
}
