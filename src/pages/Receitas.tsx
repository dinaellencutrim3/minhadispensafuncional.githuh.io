import { useState } from "react";
import { Search, Clock, Users, ChefHat, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";

interface Recipe {
  id: string;
  title: string;
  image: string;
  time: string;
  servings: number;
  matchedIngredients: string[];
  totalIngredients: number;
  difficulty: "Fácil" | "Médio" | "Difícil";
}

const mockRecipes: Recipe[] = [
  {
    id: "1",
    title: "Omelete de Tomate e Queijo",
    image: "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=400&h=300&fit=crop",
    time: "15 min",
    servings: 2,
    matchedIngredients: ["Tomates", "Leite"],
    totalIngredients: 5,
    difficulty: "Fácil",
  },
  {
    id: "2",
    title: "Arroz com Legumes",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
    time: "30 min",
    servings: 4,
    matchedIngredients: ["Arroz", "Cenouras"],
    totalIngredients: 6,
    difficulty: "Fácil",
  },
  {
    id: "3",
    title: "Smoothie de Iogurte com Frutas",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop",
    time: "5 min",
    servings: 1,
    matchedIngredients: ["Iogurte Natural", "Leite"],
    totalIngredients: 4,
    difficulty: "Fácil",
  },
  {
    id: "4",
    title: "Feijão Tropeiro",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop",
    time: "45 min",
    servings: 6,
    matchedIngredients: ["Feijão Preto"],
    totalIngredients: 8,
    difficulty: "Médio",
  },
];

const Receitas = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes] = useState<Recipe[]>(mockRecipes);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil": return "bg-success/20 text-success";
      case "Médio": return "bg-warning/20 text-warning-foreground";
      case "Difícil": return "bg-destructive/20 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Receitas" subtitle="Baseadas na sua despensa" />

      {/* Search */}
      <div className="px-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar receitas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* AI Suggestion Banner */}
      <div className="px-4 mb-6">
        <Card className="ai-suggestion-card p-4 border-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-foreground/20 rounded-full">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-foreground text-sm">Sugestão Inteligente</h3>
              <p className="text-xs text-primary-foreground/80">
                Use seus tomates que vencem amanhã em uma omelete!
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recipes Grid */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Receitas Disponíveis</h2>
          <span className="text-sm text-muted-foreground">{filteredRecipes.length} receitas</span>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {filteredRecipes.map((recipe) => (
            <Card key={recipe.id} className="overflow-hidden border-0 shadow-md cursor-pointer hover:shadow-lg transition-shadow">
              <div className="flex">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-28 h-28 object-cover"
                />
                <div className="flex-1 p-3">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm leading-tight pr-2">{recipe.title}</h3>
                    <Badge className={getDifficultyColor(recipe.difficulty)}>
                      {recipe.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {recipe.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {recipe.servings} porções
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ChefHat className="h-3 w-3 text-primary" />
                    <span className="text-xs text-primary font-medium">
                      {recipe.matchedIngredients.length}/{recipe.totalIngredients} ingredientes
                    </span>
                  </div>
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

export default Receitas;
