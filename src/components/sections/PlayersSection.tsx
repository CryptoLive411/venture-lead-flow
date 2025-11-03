import teamImage from "@/assets/team-year-1.png";
import topImage from "@/assets/top-25.png";

export const PlayersSection = () => {
  const players = [
    { name: "Henrique Santos", school: "NC State U" },
    { name: "Fernando Silva", school: "UTRGV" },
    { name: "Quenzi Heuerman", school: "Seton Hall & UNC Chapel Hill" },
    { name: "Bernardo Monteiro", school: "Florida International U" },
    { name: "Diego Castillo", school: "Utah Valley & FIU" },
    { name: "Filip Jauk", school: "Florida Atlantic U & UNC Charlotte" },
    { name: "Umberto Pela", school: "University of Virginia" },
    { name: "Jose Conte", school: "UCLA" },
    { name: "Santiago Ruiz", school: "Incarnate Word U" },
    { name: "Joao Domingues", school: "Florida International U" },
    { name: "Fabio Guerreiro", school: "UCF" },
    { name: "Gabriel Pacheco", school: "Hofstra" },
    { name: "Rui Reis", school: "Akron U" }
  ];

  const stats = [
    { value: "1.3%", label: "High school to NCAA D1" },
    { value: "5.6%", label: "High school to NCAA" },
    { value: "23,400", label: "NCAA Soccer Athletes" }
  ];

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Our Success Stories
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join hundreds of athletes who have achieved their college soccer dreams through Venture
          </p>
        </div>

        {/* Images */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-6xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={teamImage} 
              alt="Team of the Year" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={topImage} 
              alt="Top 25 Rankings" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Players List */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">Some Athletes We've Placed</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map((player, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-card to-secondary/20 rounded-xl p-4 border border-border hover:border-primary transition-all hover:shadow-lg"
              >
                <div className="font-bold text-foreground">{player.name}</div>
                <div className="text-sm text-muted-foreground mt-1">{player.school}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Pathway Quote */}
        <div className="mt-16 max-w-4xl mx-auto bg-primary/5 rounded-2xl p-8 border-2 border-primary/20">
          <div className="text-center">
            <div className="text-5xl mb-4">🏆</div>
            <p className="text-lg text-foreground italic mb-2">
              "The American sports system uses the college route as a pathway to the professional level."
            </p>
            <p className="text-sm text-muted-foreground">
              Each year, up to 90 men's players and 36 women's players are drafted by MLS and NWSL clubs every January.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
