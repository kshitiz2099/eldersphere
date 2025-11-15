import { useState } from 'react';
import { Mic, Heart, ChevronRight, Check } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { VoiceWaveform } from '../components/VoiceWaveform';

interface OnboardingPageProps {
  onComplete: () => void;
}

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState('');
  const [isListening, setIsListening] = useState(false);

  const steps = [
    {
      title: 'Welcome',
      content: (
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-8 bg-[#7FA5B8] rounded-full flex items-center justify-center">
            <Heart className="text-white" size={64} />
          </div>
          <h1 className="mb-6">Welcome to Your AI Companion</h1>
          <p className="text-xl text-[#5B4B43] mb-8 max-w-2xl mx-auto">
            I'm here to help you stay independent, connected, and safe. 
            Let's get to know each other.
          </p>
        </div>
      ),
    },
    {
      title: 'Your Name',
      content: (
        <div className="text-center">
          <h2 className="mb-6">What should I call you?</h2>
          <p className="text-xl text-[#5B4B43] mb-8">
            You can type or speak your name
          </p>
          <Card variant="default" className="mb-6">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name"
              className="w-full text-2xl p-6 bg-transparent border-none outline-none text-center"
            />
          </Card>
          <Button
            variant="gentle"
            size="large"
            fullWidth
            icon={<Mic />}
            onClick={() => {
              setIsListening(!isListening);
              setTimeout(() => {
                setUserName('Mari');
                setIsListening(false);
              }, 2000);
            }}
          >
            {isListening ? 'Listening...' : 'Or speak your name'}
          </Button>
        </div>
      ),
    },
    {
      title: 'Voice Test',
      content: (
        <div className="text-center">
          <h2 className="mb-6">Let's test the voice</h2>
          <p className="text-xl text-[#5B4B43] mb-8">
            Tap the button and say "Hello"
          </p>
          <Card variant="default" className="mb-6">
            <VoiceWaveform isActive={isListening} />
          </Card>
          <Button
            variant={isListening ? 'emergency' : 'primary'}
            size="extra-large"
            fullWidth
            icon={<Mic />}
            onClick={() => setIsListening(!isListening)}
          >
            {isListening ? 'I hear you!' : 'Test voice'}
          </Button>
          {isListening && (
            <Card variant="soft" className="mt-6">
              <p className="text-lg text-[#5B4B43]">
                Great! I can hear you clearly.
              </p>
            </Card>
          )}
        </div>
      ),
    },
    {
      title: 'Text Size',
      content: (
        <div className="text-center">
          <h2 className="mb-6">Choose your text size</h2>
          <p className="text-xl text-[#5B4B43] mb-8">
            Pick the size that's easiest for you to read
          </p>
          <div className="space-y-4">
            {['This is small text', 'This is medium text', 'This is large text', 'This is extra large text'].map((text, index) => (
              <Card
                key={index}
                variant="default"
                onClick={() => {}}
                className="cursor-pointer hover:border-4 hover:border-[#7FA5B8]"
              >
                <p className={`
                  ${index === 0 ? 'text-lg' :
                    index === 1 ? 'text-xl' :
                    index === 2 ? 'text-2xl' : 'text-3xl'}
                `}>
                  {text}
                </p>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Privacy',
      content: (
        <div className="text-center">
          <h2 className="mb-6">Your privacy matters</h2>
          <p className="text-xl text-[#5B4B43] mb-8">
            Here's what you should know
          </p>
          <div className="space-y-4 text-left max-w-2xl mx-auto">
            <Card variant="default">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#6B9B6E] rounded-full flex items-center justify-center shrink-0">
                  <Check className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="mb-2">Your data stays private</h3>
                  <p className="text-lg text-[#5B4B43]">
                    We never share your exact location or personal details
                  </p>
                </div>
              </div>
            </Card>
            <Card variant="default">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#6B9B6E] rounded-full flex items-center justify-center shrink-0">
                  <Check className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="mb-2">You're in control</h3>
                  <p className="text-lg text-[#5B4B43]">
                    You decide what to share with family
                  </p>
                </div>
              </div>
            </Card>
            <Card variant="default">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#6B9B6E] rounded-full flex items-center justify-center shrink-0">
                  <Check className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="mb-2">Safe and secure</h3>
                  <p className="text-lg text-[#5B4B43]">
                    All conversations are encrypted
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ),
    },
    {
      title: 'Ready',
      content: (
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-8 bg-[#A7BFA7] rounded-full flex items-center justify-center">
            <Check className="text-white" size={64} />
          </div>
          <h1 className="mb-6">You're all set{userName ? `, ${userName}` : ''}!</h1>
          <p className="text-xl text-[#5B4B43] mb-8 max-w-2xl mx-auto">
            I'm here whenever you need me. Just tap the microphone to start talking.
          </p>
          <Card variant="soft" className="mb-8">
            <h3 className="mb-4">Remember, I can help you:</h3>
            <ul className="space-y-3 text-left max-w-xl mx-auto">
              <li className="flex items-start gap-3">
                <span className="text-2xl">💬</span>
                <p className="text-lg">Have friendly conversations</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🗓️</span>
                <p className="text-lg">Remember important dates and people</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🌍</span>
                <p className="text-lg">Find local activities and events</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🛡️</span>
                <p className="text-lg">Stay safe and connected</p>
              </li>
            </ul>
          </Card>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F2] to-[#E8DFD4]">
      <div className="px-5 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex gap-2 justify-center mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === step
                    ? 'w-10 bg-[#7FA5B8]'
                    : index < step
                    ? 'w-6 bg-[#A7BFA7]'
                    : 'w-6 bg-[#E8DFD4]'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-lg text-[#5B4B43]">
            Step {step + 1} of {steps.length}
          </p>
        </div>

        {/* Content */}
        <div className="mb-8">
          {steps[step].content}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && (
            <Button
              variant="gentle"
              size="large"
              onClick={handleBack}
            >
              Back
            </Button>
          )}
          <Button
            variant="primary"
            size="large"
            fullWidth
            icon={step === steps.length - 1 ? <Check /> : <ChevronRight />}
            onClick={handleNext}
            disabled={step === 1 && !userName}
          >
            {step === steps.length - 1 ? 'Start using companion' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}