import { useLanguage } from "@/contexts/LanguageContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import youssefImg from "@/assets/players/youssef.png";
import timImg from "@/assets/players/tim.png";
import pedroBaischImg from "@/assets/players/pedro-baisch.png";
import pedroCaeiroImg from "@/assets/players/pedro-caeiro.png";
import rodrigoSilvaImg from "@/assets/players/rodrigo-silva.png";
import ryadImg from "@/assets/players/ryad.png";
import umbertoImg from "@/assets/players/umberto-pela.png";
import raiPintoImg from "@/assets/players/rai-pinto.png";
import miloImg from "@/assets/players/milo-peters.png";

export const PlayersSection = () => {
  const { t } = useLanguage();

  const playerImages = [
    { src: youssefImg, alt: "Youssef Shafei - Central Connecticut" },
    { src: timImg, alt: "Tim Noeding - Syracuse" },
    { src: pedroBaischImg, alt: "Pedro Baisch - Merrimack" },
    { src: pedroCaeiroImg, alt: "Pedro Caeiro - NC State" },
    { src: rodrigoSilvaImg, alt: "Rodrigo Silva - Bowling Green" },
    { src: ryadImg, alt: "Ryad - Southern Connecticut Owls" },
    { src: umbertoImg, alt: "Umberto Pela - University of Virginia" },
    { src: raiPintoImg, alt: "Rai Pinto - Marshall" },
    { src: miloImg, alt: "Milo Peters - Dartmouth" },
  ];

  const stats = [
    { value: "1.3%", labelKey: "players.stats.stat1" },
    { value: "5.6%", labelKey: "players.stats.stat2" },
    { value: "23,400", labelKey: "players.stats.stat3" }
  ];

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-background via-primary/3 to-background overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(59,130,246,0.06)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_rgba(59,130,246,0.04)_0%,_transparent_50%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="container relative mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-6 py-2 bg-primary/10 rounded-full border border-primary/20 shadow-lg shadow-primary/5">
            <span className="text-sm font-semibold text-primary">🏆 {t('players.athletesPlaced')}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            {t('players.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('players.subtitle')}
          </p>
          <div className="mt-8 mx-auto w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
        </div>

        {/* Player Commitment Slider */}
        <div className="max-w-6xl mx-auto mb-20">
          <Carousel
            opts={{ align: "start", loop: true }}
            className="w-full"
          >
            <CarouselContent>
              {playerImages.map((player, index) => (
                <CarouselItem key={index} className="basis-1/2 sm:basis-1/3 lg:basis-1/4">
                  <div className="p-2">
                    <div className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-primary/20 hover:scale-105 transition-all duration-500 border-2 border-border hover:border-primary/40 group">
                      <img 
                        src={player.src} 
                        alt={player.alt} 
                        className="w-full h-auto object-cover group-hover:brightness-110 transition-all duration-500"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 bg-card border-2 border-primary/20 hover:bg-primary hover:text-white shadow-lg" />
            <CarouselNext className="hidden md:flex -right-12 bg-card border-2 border-primary/20 hover:bg-primary hover:text-white shadow-lg" />
          </Carousel>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.labelKey} className="text-center p-6 bg-gradient-to-br from-card to-secondary/30 rounded-2xl border border-border shadow-lg hover:shadow-xl hover:border-primary/30 transition-all hover:-translate-y-1">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent-blue bg-clip-text text-transparent mb-2">{stat.value}</div>
              <div className="text-muted-foreground text-sm font-medium">{t(stat.labelKey)}</div>
            </div>
          ))}
        </div>

        {/* Professional Pathway Quote */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/5 via-accent-blue/5 to-primary/5 rounded-3xl p-10 border-2 border-primary/20 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-blue/5 rounded-full blur-3xl" />
          <div className="relative text-center">
            <div className="text-5xl mb-4">🏆</div>
            <p className="text-lg text-foreground italic mb-2">
              {t('players.quote')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('players.quoteSubtext')}
            </p>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  );
};
