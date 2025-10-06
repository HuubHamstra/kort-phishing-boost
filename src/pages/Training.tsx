import { useEffect, useRef, useState } from "react";
import { Shield, CheckCircle, XCircle, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { saveTrainingResult } from "@/integrations/supabase/saveTrainingResult";

interface Question {
  id: number;
  subject: string;
  from: string;
  content: string;
  isPhishing: boolean;
  explanation: string;
  warningSignals?: string[];
}

const questions: Question[] = [
  {
    id: 1,
    subject: "Urgent: Verifieer uw bankgegevens binnen 24 uur!",
    from: "service@rabobank-verify.net",
    content:
      "Geachte klant,\n\nWe hebben verdachte activiteit op uw rekening gedetecteerd. Om uw account te beschermen, moet u binnen 24 uur uw gegevens verifiëren.\n\nKlik hier om in te loggen: http://rabobank-verify.net/login\n\nAls u dit niet doet, wordt uw rekening geblokkeerd.\n\nMet vriendelijke groet,\nRabobank Security Team",
    isPhishing: true,
    explanation:
      "Dit is phishing! Echte banken vragen nooit via e-mail om in te loggen of persoonlijke gegevens te verstrekken.",
    warningSignals: [
      "Dringende taal en tijdsdruk (24 uur)",
      "Verdacht e-mailadres (rabobank-verify.net in plaats van rabobank.nl)",
      "Link naar externe website",
      "Dreiging met blokkering",
    ],
  },
  {
    id: 2,
    subject: "Maandelijkse nieuwsbrief - April 2024",
    from: "newsletter@bedrijf.nl",
    content:
      "Beste collega's,\n\nHierbij ontvang je onze maandelijkse nieuwsbrief met updates over:\n\n• Nieuwe projecten\n• Teamuitjes volgende maand\n• IT-updates en trainingen\n\nMeer informatie vind je op ons intranet.\n\nGroet,\nCommunicatieteam",
    isPhishing: false,
    explanation:
      "Dit is een legitieme e-mail. Het is een interne nieuwsbrief zonder verdachte links of verzoeken om persoonlijke informatie.",
    warningSignals: [],
  },
  {
    id: 3,
    subject: "Re: Factuur #2024-1893 - Betaling Vereist",
    from: "finance@supplier-payment.com",
    content:
      "Geachte heer/mevrouw,\n\nOnze administratie heeft geconstateerd dat factuur #2024-1893 nog niet is voldaan.\n\nBedrag: €4.850,00\nVervaldatum: 15 maart 2024\n\nZie bijgevoegde factuur voor details. Gelieve het bedrag binnen 3 dagen over te maken naar:\n\nIBAN: NL89 INGB 0123 4567 89\nT.n.v.: Payment Processing Services\n\nBij vragen, bel ons op +31 6 1234 5678",
    isPhishing: true,
    explanation:
      "Dit is phishing! De afzender is onbekend, er is druk om snel te betalen, en het IBAN-nummer lijkt niet legitiem.",
    warningSignals: [
      "Onbekende afzender (supplier-payment.com)",
      "Onverwachte factuur zonder eerdere correspondentie",
      "Druk om snel te betalen (3 dagen)",
      "Verdacht rekeningnummer naar 'Payment Processing Services'",
    ],
  },
  {
    id: 4,
    subject: "Uitnodiging: Teamvergadering Q2 Planning",
    from: "jan.smit@bedrijf.nl",
    content:
      "Hoi allemaal,\n\nHierbij de uitnodiging voor onze kwartaal planning meeting:\n\nDatum: Dinsdag 16 april\nTijd: 10:00 - 12:00\nLocatie: Vergaderzaal 3B\n\nAgenda:\n1. Resultaten Q1\n2. Doelstellingen Q2\n3. Resourceplanning\n\nGraag voor vrijdag bevestigen.\n\nGroet,\nJan",
    isPhishing: false,
    explanation:
      "Dit is een legitieme e-mail van een collega met een normale meeting uitnodiging. Geen verdachte elementen.",
    warningSignals: [],
  },
  {
    id: 5,
    subject: "Onderwerp: Belangrijk: verplichte training digitale veiligheid",
    from: "herman.wehkamp@mantter.com",
    content:
      "Hallo $medewerker,\n\nOm onze digitale veiligheid scherp te houden starten we deze week met een verplichte phishingtraining.\n\nHet duurt maar zo’n 5 minuten en laat je zien hoe je verdachte mails snel kunt herkennen en melden.\n\nHieronder volgt een knop om te starten:\n\n[Start training — interne leerportal]\n\nGroeten,\n\nHerman Wehkamp",
    isPhishing: true,
    explanation:
      "Dit is phishing! Hoewel de mail lijkt te komen van een interne bron, is het doel om bewustwording te testen. Controleer altijd afzender en link voordat je klikt.",
    warningSignals: [
      "Onverwachte mail over een training zonder aankondiging via officiële kanalen",
      "Druk om direct te handelen ('verplichte training, start nu')",
      "Link in de mail — kan leiden naar een valse inlogpagina",
      "Algemene aanhef ($medewerker i.p.v. je naam)",
    ],
  },
];

const Training = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<
    {
      question_id: number;
      user_answer: boolean;
      correct_answer: boolean;
      is_phishing_correct: boolean;
    }[]
  >([]);
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const savedRef = useRef(false);

  const progress =
    ((currentQuestion + (answered ? 1 : 0)) / questions.length) * 100;
  const question = questions[currentQuestion];

  const handleAnswer = (isPhishingAnswer: boolean) => {
    setSelectedAnswer(isPhishingAnswer);
    setAnswered(true);

    const isCorrect = isPhishingAnswer === question.isPhishing;
    if (isCorrect) {
      setScore(score + 1);
      toast.success("Correct! 🎉");
    } else {
      toast.error("Helaas, niet correct");
    }
    setAnswers((prev) => [
      ...prev,
      {
        question_id: question.id,
        user_answer: isPhishingAnswer,
        correct_answer: question.isPhishing,
        is_phishing_correct: isCorrect,
      },
    ]);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);
    }
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return "Perfect! Je bent een phishing expert! 🏆";
    if (percentage >= 80) return "Uitstekend! Je herkent phishing goed! 🎯";
    if (percentage >= 60) return "Goed gedaan! Met wat oefening ben je er! 👍";
    return "Je kunt nog veel leren. Doe de training opnieuw! 💪";
  };

  useEffect(() => {
    if (showResults && !savedRef.current) {
      savedRef.current = true; // guard tegen dubbel opslaan
      const percentage = (score / questions.length) * 100;
      saveTrainingResult({
        session_id: sessionIdRef.current,
        score,
        total_questions: questions.length,
        answers: answers as any, // typed as Json in table
        percentage,
      })
        .then(() => {
          toast.success("Resultaat opgeslagen ✅");
        })
        .catch((err) => {
          savedRef.current = false; // laat retry toe bij volgende render / refresh
          console.error("Fout bij opslaan training resultaat", err);
          toast.error("Opslaan resultaat mislukt");
        });
    }
  }, [showResults, score, answers]);

  if (showResults) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 text-center">
          <div className="mb-6">
            {score === questions.length ? (
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-primary" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-accent" />
              </div>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Training Voltooid!
          </h1>

          <div className="text-6xl font-bold text-primary mb-4">
            {score}/{questions.length}
          </div>

          <p className="text-xl text-muted-foreground mb-8">
            {getScoreMessage()}
          </p>

          <div className="bg-muted/30 rounded-lg p-6 mb-8">
            <h3 className="font-semibold mb-3">Belangrijkste lessen:</h3>
            <ul className="text-left space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Controleer altijd de afzender en het e-mailadres</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Wees alert op dringende taal en tijdsdruk</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Hover over links voordat je klikt</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Bij twijfel: vraag het na bij de afzender</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Home className="w-4 h-4 mr-2" />
                Terug naar Home
              </Button>
            </Link>
            <Button
              variant="hero"
              size="lg"
              onClick={() => {
                setCurrentQuestion(0);
                setScore(0);
                setAnswered(false);
                setSelectedAnswer(null);
                setShowResults(false);
                setAnswers([]);
                savedRef.current = false;
                sessionIdRef.current = crypto.randomUUID();
              }}
            >
              Doe Training Opnieuw
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <Home className="w-4 h-4 mr-2" />
              Terug
            </Button>
          </Link>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Phishing Training</h1>
              <p className="text-muted-foreground">
                Vraag {currentQuestion + 1} van {questions.length}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{score}</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
          </div>

          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="p-6 md:p-8 mb-6">
          <div className="mb-6">
            <div className="text-sm text-muted-foreground mb-2">Van:</div>
            <div className="font-mono text-sm bg-muted p-3 rounded mb-4">
              {question.from}
            </div>

            <div className="text-sm text-muted-foreground mb-2">Onderwerp:</div>
            <div className="font-semibold text-lg mb-4">{question.subject}</div>

            <div className="text-sm text-muted-foreground mb-2">Bericht:</div>
            <div className="bg-muted/50 p-4 rounded whitespace-pre-line text-sm border border-border">
              {question.content}
            </div>
          </div>

          {!answered ? (
            <div className="space-y-4">
              <p className="text-center font-medium mb-4">
                Is dit een phishing e-mail?
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleAnswer(true)}
                  className="h-auto py-6 hover:border-destructive hover:bg-destructive/5"
                >
                  <div className="flex flex-col items-center gap-2">
                    <XCircle className="w-8 h-8 text-destructive" />
                    <span className="font-semibold">Ja, dit is Phishing</span>
                    <span className="text-xs text-muted-foreground">
                      Deze e-mail is verdacht
                    </span>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleAnswer(false)}
                  className="h-auto py-6 hover:border-primary hover:bg-primary/5"
                >
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="w-8 h-8 text-primary" />
                    <span className="font-semibold">Nee, dit is Legitiem</span>
                    <span className="text-xs text-muted-foreground">
                      Deze e-mail is veilig
                    </span>
                  </div>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-lg border-2 ${
                  selectedAnswer === question.isPhishing
                    ? "bg-primary/5 border-primary"
                    : "bg-destructive/5 border-destructive"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {selectedAnswer === question.isPhishing ? (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                  <span className="font-semibold">
                    {selectedAnswer === question.isPhishing
                      ? "Correct!"
                      : "Helaas, niet correct"}
                  </span>
                </div>
                <p className="text-sm">{question.explanation}</p>
              </div>

              {question.warningSignals &&
                question.warningSignals.length > 0 && (
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Waarschuwingssignalen:
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {question.warningSignals.map((signal, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-destructive mt-0.5">•</span>
                          <span>{signal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              <Button
                variant="hero"
                size="lg"
                onClick={handleNext}
                className="w-full"
              >
                {currentQuestion < questions.length - 1 ? (
                  <>
                    Volgende Vraag
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  "Bekijk Resultaten"
                )}
              </Button>
            </div>
          )}
        </Card>

        {/* Tips */}
        {!answered && (
          <Card className="p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground text-center">
              💡 <strong>Tip:</strong> Let op het e-mailadres van de afzender,
              de toon van het bericht, en of er om persoonlijke informatie wordt
              gevraagd.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Training;
