using Microsoft.EntityFrameworkCore;
using TrailGuide.API.Models.Domain;

namespace TrailGuide.API.Data;

public class TrailGuideDbContext : DbContext
{
    public TrailGuideDbContext(DbContextOptions<TrailGuideDbContext> options) : base(options) { }

    // 基礎資料
    public DbSet<County> Counties => Set<County>();
    public DbSet<Location> Locations => Set<Location>();
    public DbSet<CountryCode> CountryCodes => Set<CountryCode>();
    public DbSet<Classification> Classifications => Set<Classification>();
    public DbSet<Chip> Chips => Set<Chip>();

    // 用戶
    public DbSet<User> Users => Set<User>();

    // 步道
    public DbSet<Trail> Trails => Set<Trail>();
    public DbSet<TrailImage> TrailImages => Set<TrailImage>();
    public DbSet<TrailHead> TrailHeads => Set<TrailHead>();
    public DbSet<ChipTrail> ChipTrails => Set<ChipTrail>();

    // 內容
    public DbSet<Collection> Collections => Set<Collection>();
    public DbSet<CollectionTrail> CollectionTrails => Set<CollectionTrail>();
    public DbSet<Article> Articles => Set<Article>();
    public DbSet<Announcement> Announcements => Set<Announcement>();
    public DbSet<Attraction> Attractions => Set<Attraction>();
    public DbSet<Banner> Banners => Set<Banner>();

    // 用戶互動
    public DbSet<Favorite> Favorites => Set<Favorite>();
    public DbSet<Comment> Comments => Set<Comment>();
    public DbSet<CommentImage> CommentImages => Set<CommentImage>();
    public DbSet<UserLikeComment> UserLikeComments => Set<UserLikeComment>();
    public DbSet<VisitedTrail> VisitedTrails => Set<VisitedTrail>();

    // 打卡與成就
    public DbSet<Checkin> Checkins => Set<Checkin>();
    public DbSet<CheckinImage> CheckinImages => Set<CheckinImage>();
    public DbSet<Achievement> Achievements => Set<Achievement>();
    public DbSet<UserAchievement> UserAchievements => Set<UserAchievement>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // PostgreSQL 使用小寫表名和欄位名
        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            // 表名轉小寫
            entity.SetTableName(entity.GetTableName()?.ToLower());

            // 欄位名轉小寫
            foreach (var property in entity.GetProperties())
            {
                property.SetColumnName(property.GetColumnName()?.ToLower());
            }

            // 索引名轉小寫
            foreach (var key in entity.GetKeys())
            {
                key.SetName(key.GetName()?.ToLower());
            }

            // 外鍵名轉小寫
            foreach (var fk in entity.GetForeignKeys())
            {
                fk.SetConstraintName(fk.GetConstraintName()?.ToLower());
            }

            // 索引名轉小寫
            foreach (var index in entity.GetIndexes())
            {
                index.SetDatabaseName(index.GetDatabaseName()?.ToLower());
            }
        }

        // User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Email).IsUnique();
        });

        // Trail
        modelBuilder.Entity<Trail>(entity =>
        {
            entity.Property(e => e.Latitude).HasColumnType("decimal(10,7)");
            entity.Property(e => e.Longitude).HasColumnType("decimal(10,7)");
            entity.Property(e => e.Evaluation).HasColumnType("decimal(3,2)");
        });

        // TrailHead
        modelBuilder.Entity<TrailHead>(entity =>
        {
            entity.Property(e => e.Latitude).HasColumnType("decimal(10,7)");
            entity.Property(e => e.Longitude).HasColumnType("decimal(10,7)");
        });

        // Attraction
        modelBuilder.Entity<Attraction>(entity =>
        {
            entity.Property(e => e.Latitude).HasColumnType("decimal(10,7)");
            entity.Property(e => e.Longitude).HasColumnType("decimal(10,7)");
        });

        // Unique constraints for junction tables
        modelBuilder.Entity<ChipTrail>()
            .HasIndex(e => new { e.ChipId, e.TrailId }).IsUnique();

        modelBuilder.Entity<CollectionTrail>()
            .HasIndex(e => new { e.CollectionId, e.TrailId }).IsUnique();

        modelBuilder.Entity<Favorite>()
            .HasIndex(e => new { e.UserId, e.TrailId }).IsUnique();

        modelBuilder.Entity<UserLikeComment>()
            .HasIndex(e => new { e.UserId, e.CommentId }).IsUnique();

        modelBuilder.Entity<VisitedTrail>()
            .HasIndex(e => new { e.UserId, e.TrailId }).IsUnique();

        // Checkin
        modelBuilder.Entity<Checkin>(entity =>
        {
            entity.Property(e => e.Latitude).HasColumnType("decimal(10,7)");
            entity.Property(e => e.Longitude).HasColumnType("decimal(10,7)");
            entity.Property(e => e.DistanceFromTrail).HasColumnType("decimal(10,2)");
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.TrailId);
            entity.HasIndex(e => e.CheckinTime);
        });

        // Achievement
        modelBuilder.Entity<Achievement>(entity =>
        {
            entity.HasIndex(e => e.Code).IsUnique();
            entity.HasIndex(e => e.Category);
            entity.HasIndex(e => e.IsHidden);
            entity.Property(e => e.ConditionValue).HasColumnType("jsonb");
        });

        // UserAchievement
        modelBuilder.Entity<UserAchievement>()
            .HasIndex(e => new { e.UserId, e.AchievementId }).IsUnique();
    }
}
