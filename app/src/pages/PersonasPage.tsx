import { Users, Target, Frown, Heart } from 'lucide-react';
import { Card } from '../components/Card';

export function PersonasPage() {
  const personas = [
    {
      name: 'Erik',
      age: 72,
      role: 'Retired Engineer',
      image: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca44',
      description: 'Widower living alone in suburban Espoo',
      needs: [
        'Maintain independence and dignity',
        'Simple, predictable daily routines',
        'Social connection without complexity',
        'Practical help without feeling patronized',
      ],
      frustrations: [
        'Overwhelming digital interfaces',
        'Feeling like a burden to family',
        'Loneliness but hesitant to reach out',
        'Difficulty remembering appointments',
      ],
      goals: [
        'Stay in his own home as long as possible',
        'Maintain meaningful relationships',
        'Keep his mind active and engaged',
        'Feel useful and capable',
      ],
      quote: '"I want to live on my own terms, not be managed by technology or family."',
    },
    {
      name: 'Liisa',
      age: 68,
      role: 'Retired Teacher',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
      description: 'Socially curious but overwhelmed by modern digital tools',
      needs: [
        'Easy way to discover local activities',
        'Gentle reminders without nagging',
        'Share stories and memories',
        'Connect with like-minded people',
      ],
      frustrations: [
        'Social media feels chaotic and unsafe',
        'Difficulty finding appropriate events',
        'Apps too complicated to navigate',
        'Privacy concerns about online platforms',
      ],
      goals: [
        'Build new friendships in retirement',
        'Pursue creative hobbies',
        'Stay mentally and socially active',
        'Feel part of her community',
      ],
      quote: '"I love meeting people, but I get lost in all these apps and notifications."',
    },
    {
      name: 'Anna',
      age: 52,
      role: 'Adult Daughter',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
      description: 'Lives in Helsinki, worried about aging mother in Espoo',
      needs: [
        'Know mother is safe without being intrusive',
        'Easy way to stay connected',
        'Peace of mind about daily wellbeing',
        'Balance caregiving with own life',
      ],
      frustrations: [
        'Guilt about not visiting enough',
        'Worry during periods of no contact',
        'Uncertainty if intervention is needed',
        'Mother resistant to "surveillance"',
      ],
      goals: [
        'Support mother\'s independence',
        'Be alerted to real concerns only',
        'Stay emotionally connected',
        'Respect mother\'s privacy and autonomy',
      ],
      quote: '"I want to support my mom without helicoptering. How do I know she\'s okay?"',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F2] to-[#E8DFD4] pb-32">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="mb-4">User Personas</h1>
          <p className="text-xl text-[#5B4B43] max-w-3xl mx-auto">
            Understanding the people we're designing for - their needs, frustrations, and goals
          </p>
        </div>

        {/* Personas */}
        <div className="space-y-12">
          {personas.map((persona, index) => (
            <Card key={index} variant="default" className="overflow-hidden">
              <div className="grid md:grid-cols-[300px_1fr] gap-8">
                {/* Profile */}
                <div className="text-center md:text-left">
                  <div className="w-48 h-48 mx-auto md:mx-0 mb-4 rounded-2xl overflow-hidden bg-[#E8DFD4]">
                    <img
                      src={persona.image}
                      alt={persona.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="mb-2">{persona.name}, {persona.age}</h2>
                  <p className="text-xl text-[#7FA5B8] mb-4">{persona.role}</p>
                  <p className="text-lg text-[#5B4B43]">{persona.description}</p>
                  <Card variant="soft" className="mt-6">
                    <p className="text-lg italic text-[#5B4B43]">
                      {persona.quote}
                    </p>
                  </Card>
                </div>

                {/* Details */}
                <div className="space-y-6">
                  {/* Needs */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-[#6B9B6E] p-2 rounded-xl">
                        <Target className="text-white" size={24} />
                      </div>
                      <h3>Needs</h3>
                    </div>
                    <ul className="space-y-2">
                      {persona.needs.map((need, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-[#6B9B6E] mt-1">•</span>
                          <p className="text-lg text-[#5B4B43]">{need}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Frustrations */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-[#B85757] p-2 rounded-xl">
                        <Frown className="text-white" size={24} />
                      </div>
                      <h3>Frustrations</h3>
                    </div>
                    <ul className="space-y-2">
                      {persona.frustrations.map((frustration, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-[#B85757] mt-1">•</span>
                          <p className="text-lg text-[#5B4B43]">{frustration}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Goals */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-[#7FA5B8] p-2 rounded-xl">
                        <Heart className="text-white" size={24} />
                      </div>
                      <h3>Goals</h3>
                    </div>
                    <ul className="space-y-2">
                      {persona.goals.map((goal, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-[#7FA5B8] mt-1">•</span>
                          <p className="text-lg text-[#5B4B43]">{goal}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Design Implications */}
        <Card variant="soft" className="mt-12">
          <h2 className="mb-6 text-center">Design Implications</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="mb-3 text-[#7FA5B8]">For Erik & Liisa</h3>
              <ul className="space-y-2 text-lg text-[#5B4B43]">
                <li>• Extra large text and buttons</li>
                <li>• Voice-first interaction</li>
                <li>• Minimal cognitive load</li>
                <li>• Dignified, not childish</li>
                <li>• Clear, predictable patterns</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-[#A7BFA7]">For Community</h3>
              <ul className="space-y-2 text-lg text-[#5B4B43]">
                <li>• Not social media</li>
                <li>• No infinite scrolling</li>
                <li>• Curated, safe events</li>
                <li>• Low-pressure joining</li>
                <li>• Built-in reminders</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-[#C17B6C]">For Anna (Family)</h3>
              <ul className="space-y-2 text-lg text-[#5B4B43]">
                <li>• Summary, not surveillance</li>
                <li>• Respect privacy</li>
                <li>• General, not specific data</li>
                <li>• Easy communication</li>
                <li>• Peace of mind focus</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
