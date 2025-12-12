import { useState } from "react";
import { Camera, Image, Plus, Check, Calendar, Barcode } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import BarcodeScanner from "@/components/BarcodeScanner";

interface ScannedItem {
  id: string;
  name: string;
  quantity: string;
  expiryDate: string;
  confirmed: boolean;
  barcode?: string;
}

// Mock product database (simulating barcode lookup)
const productDatabase: Record<string, { name: string; category: string }> = {
  "7891000100103": { name: "Leite Integral Nestlé", category: "Laticínios" },
  "7891149410116": { name: "Arroz Tio João 5kg", category: "Grãos" },
  "7891000053508": { name: "Nescafé Tradicional 200g", category: "Bebidas" },
  "7896004400013": { name: "Óleo de Soja Soya 900ml", category: "Óleos" },
  "7891031411001": { name: "Açúcar União 1kg", category: "Açúcares" },
  "7896036093085": { name: "Feijão Carioca Camil 1kg", category: "Grãos" },
  "7891000315804": { name: "Biscoito Negresco", category: "Biscoitos" },
  "7896102500059": { name: "Macarrão Barilla 500g", category: "Massas" },
};

const Adicionar = () => {
  const { toast } = useToast();
  const [mode, setMode] = useState<"select" | "scan" | "manual" | "confirm" | "barcode">("select");
  const [isProcessing, setIsProcessing] = useState(false);
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [manualItem, setManualItem] = useState({ name: "", quantity: "", expiryDate: "", barcode: "" });
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);

  const simulateScan = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setScannedItems([
        { id: "1", name: "Arroz", quantity: "1 uni", expiryDate: "05/09/2024", confirmed: false },
        { id: "2", name: "Tomates", quantity: "6 uni", expiryDate: "09/09/2024", confirmed: false },
        { id: "3", name: "Tomates", quantity: "8 uni", expiryDate: "04/09/2024", confirmed: false },
        { id: "4", name: "Iogurte Natural", quantity: "4 uni", expiryDate: "06/09/2024", confirmed: false },
      ]);
      setIsProcessing(false);
      setMode("confirm");
    }, 2000);
  };

  const handleBarcodeScanned = (barcode: string) => {
    setShowBarcodeScanner(false);
    
    // Look up product in database
    const product = productDatabase[barcode];
    
    if (product) {
      setManualItem({
        name: product.name,
        quantity: "1 uni",
        expiryDate: "",
        barcode: barcode,
      });
      toast({
        title: "Produto Encontrado!",
        description: `${product.name} identificado pelo código de barras.`,
      });
    } else {
      setManualItem({
        name: "",
        quantity: "1 uni",
        expiryDate: "",
        barcode: barcode,
      });
      toast({
        title: "Código Escaneado",
        description: `Código ${barcode}. Preencha os dados do produto.`,
      });
    }
    
    setMode("manual");
  };

  const confirmItem = (id: string) => {
    setScannedItems(items =>
      items.map(item =>
        item.id === id ? { ...item, confirmed: true } : item
      )
    );
  };

  const saveInventory = () => {
    toast({
      title: "Inventário Salvo!",
      description: `${scannedItems.filter(i => i.confirmed).length} itens adicionados à despensa.`,
    });
    setMode("select");
    setScannedItems([]);
  };

  const addManualItem = () => {
    if (!manualItem.name || !manualItem.quantity || !manualItem.expiryDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para adicionar o item.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Item Adicionado!",
      description: `${manualItem.name} foi adicionado à despensa.`,
    });
    setManualItem({ name: "", quantity: "", expiryDate: "", barcode: "" });
    setMode("select");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Nova Compra" subtitle="Registrar Nota" showBack />

      {mode === "select" && (
        <div className="px-4 space-y-4">
          {/* Barcode Scanner Card */}
          <Card 
            className="p-6 cursor-pointer border-0 shadow-md bg-gradient-to-br from-primary to-primary/80"
            onClick={() => setShowBarcodeScanner(true)}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-foreground/20 rounded-xl">
                <Barcode className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-primary-foreground text-lg">Escanear Código de Barras</h3>
                <p className="text-sm text-primary-foreground/80">Use a câmera para identificar produtos</p>
              </div>
            </div>
          </Card>

          {/* Scan Receipt Card */}
          <Card 
            className="scan-card p-6 cursor-pointer border-0"
            onClick={() => { setMode("scan"); simulateScan(); }}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-foreground/20 rounded-xl">
                <Camera className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-primary-foreground text-lg">Tirar Foto da Nota</h3>
                <p className="text-sm text-primary-foreground/80">Escaneie sua nota fiscal</p>
              </div>
            </div>
          </Card>

          {/* Gallery Card */}
          <Card 
            className="gallery-card p-6 cursor-pointer border-0"
            onClick={() => { setMode("scan"); simulateScan(); }}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary-foreground/20 rounded-xl">
                <Image className="h-8 w-8 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-foreground text-lg">Carregar Imagem da Galeria</h3>
                <p className="text-sm text-secondary-foreground/80">Selecione uma foto existente</p>
              </div>
            </div>
          </Card>

          {/* Manual Entry Card */}
          <Card 
            className="p-6 cursor-pointer border-0 shadow-md bg-card"
            onClick={() => setMode("manual")}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent rounded-xl">
                <Plus className="h-8 w-8 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Adicionar Manualmente</h3>
                <p className="text-sm text-muted-foreground">Digite os dados do produto</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {mode === "scan" && isProcessing && (
        <div className="px-4">
          <Card className="p-8 border-0 shadow-md text-center">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 mb-6 relative">
                <div className="absolute inset-0 border-4 border-primary/30 rounded-lg animate-pulse" />
                <div className="absolute inset-2 border-2 border-primary rounded-lg" />
                <div className="absolute inset-4 flex items-center justify-center">
                  <Camera className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">Processando IA</h3>
              <p className="text-sm text-muted-foreground">
                Nossa IA está extraindo os itens e validades.
              </p>
            </div>
          </Card>
        </div>
      )}

      {mode === "confirm" && (
        <div className="px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Confirme os Itens ({scannedItems.length})</h2>
            <span className="text-sm text-muted-foreground">12/10/2024</span>
          </div>
          <div className="space-y-3 mb-6">
            {scannedItems.map((item) => (
              <Card key={item.id} className="p-4 border-0 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm px-3 py-1 rounded-full ${item.confirmed ? "bg-success/20 text-success" : "bg-warning/20 text-warning-foreground"}`}>
                      {item.expiryDate}
                    </span>
                    <button
                      onClick={() => confirmItem(item.id)}
                      className={`p-2 rounded-full transition-colors ${
                        item.confirmed
                          ? "bg-success text-success-foreground"
                          : "bg-muted text-muted-foreground hover:bg-success/20"
                      }`}
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Button className="w-full" size="lg" onClick={saveInventory}>
            Salvar Inventário
          </Button>
        </div>
      )}

      {mode === "manual" && (
        <div className="px-4 space-y-4">
          <Card className="p-6 border-0 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Adicionar Produto</h3>
              {!manualItem.barcode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBarcodeScanner(true)}
                >
                  <Barcode className="h-4 w-4 mr-1" />
                  Escanear
                </Button>
              )}
            </div>
            
            {manualItem.barcode && (
              <div className="mb-4 p-3 bg-accent rounded-lg">
                <p className="text-xs text-muted-foreground">Código de Barras</p>
                <p className="font-mono text-sm">{manualItem.barcode}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Produto</Label>
                <Input
                  id="name"
                  placeholder="Ex: Leite Integral"
                  value={manualItem.name}
                  onChange={(e) => setManualItem({ ...manualItem, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  placeholder="Ex: 2 litros"
                  value={manualItem.quantity}
                  onChange={(e) => setManualItem({ ...manualItem, quantity: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="expiry">Data de Validade</Label>
                <div className="relative">
                  <Input
                    id="expiry"
                    type="date"
                    value={manualItem.expiryDate}
                    onChange={(e) => setManualItem({ ...manualItem, expiryDate: e.target.value })}
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>
          </Card>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => {
              setMode("select");
              setManualItem({ name: "", quantity: "", expiryDate: "", barcode: "" });
            }}>
              Cancelar
            </Button>
            <Button className="flex-1" onClick={addManualItem}>
              Adicionar
            </Button>
          </div>
        </div>
      )}

      {/* Barcode Scanner Modal */}
      <BarcodeScanner
        isOpen={showBarcodeScanner}
        onClose={() => setShowBarcodeScanner(false)}
        onScan={handleBarcodeScanned}
      />

      <BottomNav />
    </div>
  );
};

export default Adicionar;