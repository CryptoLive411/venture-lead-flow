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
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            {t('players.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('players.subtitle')}
          </p>
        </div>

        {/* Player Commitment Slider */}
        <div className="max-w-6xl mx-auto mb-16">
          <Carousel
            opts={{ align: "start", loop: true }}
            className="w-full"
          >
            <CarouselContent>
              {playerImages.map((player, index) => (
                <CarouselItem key={index} className="basis-1/2 sm:basis-1/3 lg:basis-1/4">
                  <div className="p-2">
                    <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                      <img 
                        src={player.src} 
                        alt={player.alt} 
                        className="w-full h-auto object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.labelKey} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{t(stat.labelKey)}</div>
            </div>
          ))}
        </div>

        {/* Professional Pathway Quote */}
        <div className="max-w-4xl mx-auto bg-primary/5 rounded-2xl p-8 border-2 border-primary/20">
          <div className="text-center">
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
    </section>
  );
};
