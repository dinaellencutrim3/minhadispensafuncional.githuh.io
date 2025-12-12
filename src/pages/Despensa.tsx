import { useState } from "react";
import { Package, Milk, Carrot, Apple, AlertTriangle, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";

interface PantryItem {
  id: string;
  name: string;
  quantity: string;
  expiryDate: string;
  daysUntilExpiry: number;
  category: string;
  icon: React.ReactNode;
}

const mockItems: PantryItem[] = [
  { id: "1", name: "Leite Integral", quantity: "2 litros", expiryDate: "15/12", daysUntilExpiry: 3, category: "Laticínios", icon: <Milk className="h-5 w-5" /> },
  { id: "2", name: "Iogurte Natural", quantity: "4 unidades", expiryDate: "14/12", daysUntilExpiry: 2, category: "Laticínios", icon: <Milk className="h-5 w-5" /> },
  { id: "3", name: "Tomates", quantity: "1 kg", expiryDate: "13/12", daysUntilExpiry: 1, category: "Vegetais", icon: <Apple className="h-5 w-5" /> },
  { id: "4", name: "Cenouras", quantity: "500g", expiryDate: "20/12", daysUntilExpiry: 8, category: "Vegetais", icon: <Carrot className="h-5 w-5" /> },
  { id: "5", name: "Feijão Preto", quantity: "1 pacote", expiryDate: "25/12", daysUntilExpiry: 13, category: "Grãos", icon: <Package className="h-5 w-5" /> },
  { id: "6", name: "Arroz", quantity: "2 kg", expiryDate: "10/01", daysUntilExpiry: 29, category: "Grãos", icon: <Package className="h-5 w-5" /> },
];

const categories = [
  { name: "Laticínios", icon: <Milk className="h-5 w-5" />, count: 8 },
  { name: "Vegetais", icon: <Carrot className="h-5 w-5" />, count: 5 },
  { name: "Frutas", icon: <Apple className="h-5 w-5" />, count: 3 },
  { name: "Grãos", icon: <Package className="h-5 w-5" />, count: 6 },
];

const Despensa = () => {
  const navigate = useNavigate();
  const [items] = useState<PantryItem[]>(mockItems);
  
  const itemsAtRisk = items.filter(item => item.daysUntilExpiry <= 3);

  const getStatusColor = (days: number) => {
    if (days <= 1) return "bg-destructive";
    if (days <= 3) return "bg-warning";
    return "bg-success";
  };

  const getStatusText = (days: number) => {
    if (days <= 0) return "Vencido";
    if (days === 1) return "Vence amanhã";
    return `${days} dias`;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header userName="Juliana" />
      
      {/* Alert Card */}
      {itemsAtRisk.length > 0 && (
        <div className="px-4 mb-6">
          <Card className="alert-card p-4 border-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-foreground/20 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-foreground">Itens em Risco ({itemsAtRisk.length})</h3>
                  <p className="text-sm text-primary-foreground/80">
                    {itemsAtRisk.slice(0, 2).map(i => i.name).join(", ")}
                  </p>
                </div>
              </div>
              <Button variant="alert" size="sm" onClick={() => navigate("/alertas")}>
                Ver Tudo
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Categories */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Categorias</h2>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((category) => (
            <button
              key={category.name}
              className="flex flex-col items-center p-3 bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-2 bg-accent rounded-full mb-2 text-accent-foreground">
                {category.icon}
              </div>
              <span className="text-xs font-medium text-center">{category.name}</span>
              <span className="text-xs text-muted-foreground">{category.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Inventory List */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Inventário Ativo</h2>
          <button className="text-sm text-primary font-medium">Ver Todos</button>
        </div>
        <div className="space-y-3">
          {items.slice(0, 5).map((item) => (
            <Card key={item.id} className="p-4 border-0 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent rounded-full text-accent-foreground">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${getStatusColor(item.daysUntilExpiry)} text-primary-foreground border-0`}>
                    {getStatusText(item.daysUntilExpiry)}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Despensa;
