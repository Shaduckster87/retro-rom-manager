import { useState, useEffect } from 'react';

const QUOTES = [
  { text: "It's dangerous to go alone!", game: "Zelda" },
  { text: "The cake is a lie.", game: "Portal" },
  { text: "Do a barrel roll!", game: "Star Fox" },
  { text: "War never changes.", game: "Fallout" },
  { text: "Stay a while and listen.", game: "Diablo" },
  { text: "Finish him!", game: "Mortal Kombat" },
  { text: "Hey! Listen!", game: "Zelda OoT" },
  { text: "All your base are belong to us.", game: "Zero Wing" },
  { text: "Waka waka waka.", game: "Pac-Man" },
  { text: "Thank you Mario!", game: "Super Mario" },
  { text: "The princess is in another castle.", game: "Super Mario" },
  { text: "Would you kindly?", game: "BioShock" },
  { text: "Get over here!", game: "Mortal Kombat" },
  { text: "I used to be an adventurer...", game: "Skyrim" },
  { text: "Rise and shine, Mr. Freeman.", game: "Half-Life 2" },
  { text: "A winner is you!", game: "Pro Wrestling" },
  { text: "Snake? SNAKE? SNAAAKE!", game: "Metal Gear" },
  { text: "Hadouken!", game: "Street Fighter" },
  { text: "Now you're playing with power!", game: "NES" },
  { text: "Up, up, down, down...", game: "Konami Code" },
];

export function GameQuoteBubble() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(prev => (prev + 1) % QUOTES.length);
        setVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const quote = QUOTES[index];

  return (
    <div className={`relative transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="pixel-border bg-card px-3 py-1.5 relative">
        <p className="font-retro text-xs text-foreground leading-tight">"{quote.text}"</p>
        <p className="font-pixel text-[6px] text-muted-foreground mt-0.5">— {quote.game}</p>
        {/* Speech bubble tail */}
        <div className="absolute -bottom-[6px] left-4 w-3 h-3 bg-card border-b-2 border-r-2 border-border transform rotate-45" />
      </div>
    </div>
  );
}
