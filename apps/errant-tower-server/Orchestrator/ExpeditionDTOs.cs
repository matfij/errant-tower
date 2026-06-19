using System.ComponentModel.DataAnnotations;
using ErrantTowerServer.Domains.Progress;

namespace ErrantTowerServer.Orchestrator;

public record GetFloorsResponse
{
    [Required]
    public required FloorTeaser[] floors;
}
