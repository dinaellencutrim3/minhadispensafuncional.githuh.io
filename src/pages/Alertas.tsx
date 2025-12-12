import { AlertTriangle, Clock, XCircle, ShoppingCart, Trash2, ChefHat } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";

interface AlertItem {
  id: string;
  name: string;
  quantity: string;
  expiryDate: string;
  status: "expiring" | "expired" | "low";
}

const alertItems: AlertItem[] = [
  { id: "1", name: "Iogurte Natural", quantity: "2 unidades", expiryDate: "amanhã", status: "expiring" },
  { id: "2", name: "Feijão Preto", quantity: "1 pacote", expiryDate: "2 dias", status: "expiring" },
  { id: "3", name: "Frango", quantity: "500g", expiryDate: "hoje", status: "expired" },
  { id: "4", name: "Requeijão", quantity: "1 pote", expiryDate: "ontem", status: "expired" },
  { id: "5", name: "Arroz", quantity: "restam 200g", expiryDate: "-", status: "low" },
  { id: "6", name: "Açúcar", quantity: "acabou", expiryDate: "-", status: "low" },
];

const Alertas = () => {
  const expiringItems = alertItems.filter(i => i.status === "expiring");
  const expiredItems = alertItems.filter(i => i.status === "expired");
  const lowItems = alertItems.filter(i => i.status === "low");

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "expiring":
        return { 
          color: "bg-warning", 
          icon: <Clock className="h-4 w-4" />,
          label: "Prestes a Vencer"
        };
      case "expired":
        return { 
          color: "bg-destructive", 
          icon: <XCircle className="h-4 w-4" />,
          label: "Vencido"
        };
      case "low":
        return { 
          color: "bg-muted", 
          icon: <ShoppingCart className="h-4 w-4" />,
          label: "Acabando"
        };
      default:
        return { color: "bg-muted", icon: null, label: "" };
    }
  };

  const AlertSection = ({ 
    title, 
    items, 
    icon, 
    color,
    actions 
  }: { 
    title: string; 
    items: AlertItem[]; 
    icon: React.ReactNode;
    color: string;
    actions: { label: string; icon: React.ReactNode; variant?: "default" | "outline" }[];
  }) => (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-1.5 rounded-full ${color}`}>
          {icon}
        </div>
        <h2 className="font-semibold">{title}</h2>
        <Badge variant="outline" className="ml-auto">{items.length}</Badge>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <Card key={item.id} className="p-3 border-0 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm">{item.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {item.status !== "low" ? `Vence ${item.expiryDate}` : item.quantity}
                </p>
              </div>
              <div className="flex gap-2">
                {actions.map((action, idx) => (
                  <Button
                    key={idx}
                    variant={action.variant || "outline"}
                    size="sm"
                    className="text-xs h-8"
                  >
                    {action.icon}
                    <span className="ml-1 hidden sm:inline">{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Alertas" subtitle="Acompanhe seus produtos" showBack />

      <div className="px-4">
        {expiringItems.length > 0 && (
          <AlertSection
            title="Prestes a Estragar"
            items={expiringItems}
            icon={<AlertTriangle className="h-4 w-4 text-warning-foreground" />}
            color="bg-warning/20"
            actions={[
              { label: "Ver Receitas", icon: <ChefHat className="h-3 w-3" /> },
            ]}
          />
        )}

        {expiredItems.length > 0 && (
          <AlertSection
            title="Vencidos Hoje"
            items={expiredItems}
            icon={<XCircle className="h-4 w-4 text-destructive-foreground" />}
            color="bg-destructive/20"
            actions={[
              { label: "Descartar", icon: <Trash2 className="h-3 w-3" />, variant: "outline" },
            ]}
          />
        )}

        {lowItems.length > 0 && (
          <AlertSection
            title="Acabando"
            items={lowItems}
            icon={<ShoppingCart className="h-4 w-4" />}
            color="bg-muted"
            actions={[
              { label: "Adicionar à Lista", icon: <ShoppingCart className="h-3 w-3" /> },
            ]}
          />
        )}

        {/* Shopping Suggestion */}
        <Card className="p-4 border-0 shadow-md bg-accent">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-foreground/20 rounded-full">
              <ShoppingCart className="h-5 w-5 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Sugestão de Compras</h3>
              <p className="text-xs text-muted-foreground">
                Baseado no seu histórico
              </p>
            </div>
            <Button size="sm">Criar Lista</Button>
          </div>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Alertas;
