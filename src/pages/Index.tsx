import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-security.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 via-background to-background" />

        <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 border border-primary/20">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">
                Bescherm je organisatie
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Leer Phishing Herkennen in{" "}
              <span className="text-primary">5 Minuten</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Een korte, praktische training die je helpt om phishing-aanvallen
              te herkennen en je gegevens veilig te houden.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/training">
                <Button variant="hero" size="lg" className="text-lg px-8">
                  Start Training Nu
                </Button>
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  5 min
                </div>
                <div className="text-sm text-muted-foreground">
                  Duur training
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">94%</div>
                <div className="text-sm text-muted-foreground">Succesrate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">10k+</div>
                <div className="text-sm text-muted-foreground">Deelnemers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <AlertTriangle className="w-12 h-12 text-accent mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Waarom is Phishing Training Belangrijk?
              </h2>
              <p className="text-lg text-muted-foreground">
                Phishing is één van de grootste cybersecurity-bedreigingen van
                dit moment
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl font-bold text-accent mb-2">91%</div>
                <div className="text-sm text-muted-foreground mb-3">
                  van cyberaanvallen
                </div>
                <p className="text-sm">
                  Begint met een phishing-e-mail die medewerkers misleidt
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl font-bold text-accent mb-2">
                  €3.86M
                </div>
                <div className="text-sm text-muted-foreground mb-3">
                  gemiddelde kosten
                </div>
                <p className="text-sm">
                  Gemiddelde schade per succesvolle phishing-aanval
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl font-bold text-accent mb-2">30%</div>
                <div className="text-sm text-muted-foreground mb-3">
                  opent phishing
                </div>
                <p className="text-sm">
                  Van de medewerkers opent phishing-e-mails zonder training
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* What is Phishing Section */}
      <section id="wat-is-phishing" className="py-20 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
              Wat is Phishing?
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-12">
              Phishing is een vorm van cybercriminaliteit waarbij aanvallers
              zich voordoen als betrouwbare organisaties om gevoelige informatie
              te stelen.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 border-2 border-destructive/20 hover:border-destructive/40 transition-colors duration-300">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  Veelvoorkomende Signalen
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span className="text-muted-foreground">
                      Dringende taal en tijdsdruk
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span className="text-muted-foreground">
                      Verdachte e-mailadressen
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span className="text-muted-foreground">
                      Spelfouten en taalfouten
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span className="text-muted-foreground">
                      Verzoek om persoonlijke gegevens
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span className="text-muted-foreground">
                      Verdachte links of bijlagen
                    </span>
                  </li>
                </ul>
              </Card>

              <Card className="p-8 border-2 border-primary/20 hover:border-primary/40 transition-colors duration-300">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  Hoe Jezelf te Beschermen
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-muted-foreground">
                      Verifieer de afzender altijd
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-muted-foreground">
                      Hover over links (klik niet direct)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-muted-foreground">
                      Gebruik multi-factor authenticatie
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-muted-foreground">
                      Rapporteer verdachte e-mails
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-muted-foreground">
                      Denk na voordat je klikt
                    </span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Training Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
              Wat Leer Je in de Training?
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-12">
              In slechts 5 minuten krijg je praktische kennis die direct
              toepasbaar is
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Echte Voorbeelden
                </h3>
                <p className="text-muted-foreground">
                  Leer aan de hand van actuele phishing-e-mails wat de trucjes
                  zijn die criminelen gebruiken
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Praktische Tips</h3>
                <p className="text-muted-foreground">
                  Krijg een checklist met concrete stappen die je direct kunt
                  toepassen in je dagelijkse werk
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Snel & Efficiënt</h3>
                <p className="text-muted-foreground">
                  Maximaal 5 minuten van je tijd voor essentiële kennis die je
                  organisatie beschermt
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Direct Resultaat</h3>
                <p className="text-muted-foreground">
                  Na de training kun je phishing-aanvallen beter herkennen en
                  voorkomen
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Users className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Klaar om te Beginnen?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Investeer 5 minuten in je digitale veiligheid en bescherm jezelf
              én je organisatie tegen phishing-aanvallen.
            </p>
            <Link to="/training">
              <Button variant="hero" size="lg" className="text-lg px-12">
                Start de Training
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-6">
              Gratis • 5 minuten • Direct toegang
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">
            © 2024 Phishing Training. Bescherm je organisatie tegen
            cyberaanvallen.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
