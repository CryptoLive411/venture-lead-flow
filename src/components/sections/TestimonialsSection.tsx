import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const TestimonialsSection = () => {
  const { t } = useLanguage();
  
  const testimonials = [
    {
      name: "Henrique Santos",
      school: "NC State",
      quote: "I have worked with agents and people that tried to help my soccer career for a big part of my life and the focus and the personal touch that I get from João is exceptional. Along with myself I owe a lot of my success to João as it's been a great journey since we started working together.",
    },
    {
      name: "Bernardo Monteiro",
      school: "Florida International U",
      quote: "Meeting Delgado and working with him has been a pleasure. Since the first moment we started this journey together, he has always been there for me and in constant contact with me and my family to help in anything needed. Besides being a very professional person, he's also a great friend now.",
    },
    {
      name: "Filip Jauk",
      school: "FAU & UNC Charlotte",
      quote: "Without him I wouldn't have been able to have a full scholarship at such a great school at one of the best soccer programs. For everything that I have here in the US, he is the first man to say thank you! He was with me from the beginning and every time made sure that everything is perfect.",
    },
    {
      name: "Nico Torres",
      school: "Utah Valley",
      quote: "Joao helped me find an incredible program in record time, my situation was not easy, and he was able in a couple of weeks to help me and give me the opportunity to compete at the best level in my last season.",
    },
    {
      name: "Umberto Pela",
      school: "University of Virginia",
      quote: "Even though we had 9 hours difference due to the time zone, they were always available to chat and share thoughts. They provided me with great opportunities, suggestions, and understood my needs perfectly. I really couldn't have asked for more.",
    },
    {
      name: "Jozo Cancar",
      school: "UT Tyler",
      quote: "I can live my dream because of one individual, who is essentially the reason I am in the US. Every time, he made sure to let me know that I meant more to him than just a soccer player. So good luck finding someone better when it comes to the knowledge and professionalism in this business.",
    },
    {
      name: "Diego Castillo",
      school: "Utah Valley & FIU",
      quote: "Working with Joao and Rodrigo in particular was the best decision I could have made. They made the process of finding a university fast and beneficial for me, thanks to them and their team I found a place which I can now call my new home.",
    },
    {
      name: "Alex Bamford",
      school: "Marshall University",
      quote: "He has a wide range of contacts across both D2 and D1 and having gone through the college game himself knows the system very well. Aside from this he is also a great person who only wants the best for those he works with.",
    },
    {
      name: "Tadej Pitvoresk",
      school: "San Diego State",
      quote: "Not only I got a great agent that provided me with everything I needed and wanted, I also got a great friend! Joao did exactly everything that he said he would, gave me great options with schools, some great advice.",
    },
    {
      name: "Fernando Silva",
      school: "UTRGV",
      quote: "Since the first day we met, he always showed me a high level of professionalism and excellence. And mainly and most important, a very honest and caring person. Without a doubt, I recommend him and his work.",
    },
    {
      name: "Joao Domingues",
      school: "FIU",
      quote: "He is a very honest person, and he always told me the real truth about the positive and negative things of the different Universities, coaches and facilities. At this point he is not only an 'agent' but a friend that I am really thankful for.",
    },
    {
      name: "Quenzi Heuerman",
      school: "Seton Hall & UNC Chapel Hill",
      quote: "He was consistent by always giving me great updates and getting me in touch with top schools. Thanks to his service, I was able to contact multiple top programs including some of the best ones in the nation.",
    },
  ];

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-background to-secondary/30 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_rgba(59,130,246,0.08)_0%,_transparent_50%)]" />
      
      <div className="container relative mx-auto px-4">
        <div className="text-center mb-20">
          <div className="inline-block mb-4 px-6 py-2 bg-primary/10 rounded-full border border-primary/20">
            <span className="text-sm font-semibold text-primary">{t('testimonials.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            {t('testimonials.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('testimonials.subtitle')}
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-2 h-full">
                    <Card className="h-full border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 bg-gradient-to-br from-card to-card/50 hover:-translate-y-1">
                      <CardContent className="p-8 flex flex-col h-full">
                        <div className="mb-6">
                          <Quote className="text-primary w-12 h-12" />
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-grow italic">
                          "{testimonial.quote}"
                        </p>
                        <div className="border-t-2 border-primary/10 pt-6">
                          <p className="font-bold text-foreground text-lg">{testimonial.name}</p>
                          <p className="text-sm text-primary font-medium mt-1">{testimonial.school}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        {/* Trust Badge */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 via-accent-blue/10 to-primary/10 px-10 py-6 rounded-2xl border-2 border-primary/20 shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all">
            <div className="flex -space-x-3">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-primary via-accent-blue to-primary border-4 border-background flex items-center justify-center text-white font-bold shadow-lg"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="font-bold text-foreground text-lg">{t('testimonials.trustBadge')}</p>
              <p className="text-sm text-muted-foreground">{t('testimonials.trustSubtext')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
