import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Camera, X, SwitchCamera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
}

const BarcodeScanner = ({ isOpen, onClose, onScan }: BarcodeScannerProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = "barcode-reader";

  const startScanner = async () => {
    if (!isOpen) return;

    try {
      setError(null);
      setIsScanning(true);

      const html5QrCode = new Html5Qrcode(containerId, {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.QR_CODE,
        ],
        verbose: false,
      });

      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode },
        {
          fps: 10,
          qrbox: { width: 280, height: 150 },
          aspectRatio: 1.777,
        },
        (decodedText) => {
          onScan(decodedText);
          stopScanner();
        },
        () => {
          // Ignore scan errors (no code found)
        }
      );
    } catch (err) {
      console.error("Scanner error:", err);
      setError("Não foi possível acessar a câmera. Verifique as permissões.");
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const toggleCamera = async () => {
    await stopScanner();
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        startScanner();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      stopScanner();
    }
    
    return () => {
      stopScanner();
    };
  }, [isOpen, facingMode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">Escanear Código de Barras</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Scanner Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <Card className="w-full max-w-sm overflow-hidden border-0 shadow-lg">
            <div
              id={containerId}
              className="w-full aspect-video bg-muted relative"
            />
          </Card>

          {error && (
            <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-lg text-center">
              <p className="text-sm">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={startScanner}
              >
                Tentar Novamente
              </Button>
            </div>
          )}

          {isScanning && (
            <p className="mt-4 text-sm text-muted-foreground text-center">
              Posicione o código de barras dentro da área de escaneamento
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 flex justify-center gap-4">
          <Button variant="outline" size="lg" onClick={toggleCamera}>
            <SwitchCamera className="h-5 w-5 mr-2" />
            Trocar Câmera
          </Button>
          <Button variant="outline" size="lg" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;