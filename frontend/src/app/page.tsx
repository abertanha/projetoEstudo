"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

interface Asset {
  id: string;
  nome: string;
  modelo: string;
  marca: string;
  numeroDeSerie: string;
  status: string;
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/assets').then((response) => {
      setAssets(response.data);
      setLoading(false);
    }).catch((error) => {
      console.error("Failed to fetch the assets:", error)
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-10">Carregando ativos...</div>;

  return (
    <main className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Ativos</h1>
        <Button asChild>
          <Link href="/assets/new">
            <Plus className="mr-2 h-4 w-4" /> Novo Equipamento
          </Link>
        </Button>
    </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Inventário Real (NestJS + Next.js)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipamento</TableHead>
                <TableHead>Modelo / Marca</TableHead>
                <TableHead>Nº de Série</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.length > 0 ? (
                assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.nome}</TableCell>
                    <TableCell>{asset.modelo} / {asset.marca}</TableCell>
                    <TableCell>{asset.numeroDeSerie}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={asset.status === 'disponivel' ? 'default' : 'outline'}>
                        {asset.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                    Nenhum ativo encontrado no banco de dados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}