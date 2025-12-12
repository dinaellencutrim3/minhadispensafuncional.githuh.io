import { useState, useEffect } from "react";
import { Download, Share, Smartphone, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Instalar = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Instalar App" subtitle="Tenha o EcoConsumo no seu celular" showBack />

      <div className="px-4 space-y-6">
        {isInstalled ? (
          <Card className="p-6 border-0 shadow-md text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-success/20 rounded-full">
                <CheckCircle className="h-12 w-12 text-success" />
              </div>
              <h2 className="text-xl font-semibold">App Instalado!</h2>
              <p className="text-muted-foreground">
                O EcoConsumo já está instalado no seu dispositivo.
              </p>
            </div>
          </Card>
        ) : (
          <>
            <Card className="p-6 border-0 shadow-md">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Smartphone className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Instale o EcoConsumo</h2>
                <p className="text-muted-foreground">
                  Tenha acesso rápido à sua despensa direto da tela inicial do celular.
                </p>
              </div>
            </Card>

            {deferredPrompt && (
              <Button className="w-full" size="lg" onClick={handleInstall}>
                <Download className="h-5 w-5 mr-2" />
                Instalar Agora
              </Button>
            )}

            {isIOS && (
              <Card className="p-6 border-0 shadow-md">
                <h3 className="font-semibold mb-4">Como instalar no iPhone:</h3>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</span>
                    <span>Toque no botão <Share className="inline h-4 w-4" /> de compartilhar no Safari</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</span>
                    <span>Role para baixo e toque em "Adicionar à Tela de Início"</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</span>
                    <span>Toque em "Adicionar" no canto superior direito</span>
                  </li>
                </ol>
              </Card>
            )}

            {!isIOS && !deferredPrompt && (
              <Card className="p-6 border-0 shadow-md">
                <h3 className="font-semibold mb-4">Como instalar no Android:</h3>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</span>
                    <span>Toque no menu do navegador (três pontos)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</span>
                    <span>Selecione "Instalar aplicativo" ou "Adicionar à tela inicial"</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</span>
                    <span>Confirme a instalação</span>
                  </li>
                </ol>
              </Card>
            )}
          </>
        )}

        {/* Benefits */}
        <div className="space-y-3">
          <h3 className="font-semibold">Benefícios do App:</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              "Acesso offline",
              "Abre mais rápido",
              "Notificações",
              "Tela cheia",
            ].map((benefit) => (
              <Card key={benefit} className="p-3 border-0 shadow-sm text-center">
                <span className="text-sm font-medium">{benefit}</span>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Instalar;