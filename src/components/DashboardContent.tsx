"use client";

import { authClient } from "../lib/auth-client";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { LogOut, User, Mail, Calendar, Shield } from "lucide-react";
import { toast } from "sonner";

export function DashboardContent() {
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Sesión cerrada correctamente");
            window.location.href = "/login";
          },
        },
      });
    } catch (error) {
      toast.error("Error al cerrar sesión");
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">No autenticado</CardTitle>
          <CardDescription className="text-center">
            Debes iniciar sesión para acceder al dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild>
            <a href="/login">Iniciar Sesión</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { user } = session;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenido de vuelta, {user.name}
          </p>
        </div>
        <Button onClick={handleLogout} variant="outline" size="sm">
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>

      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Información del Usuario
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Nombre:</span>
                <span>{user.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Email verificado:</span>
                <Badge variant={user.emailVerified ? "default" : "secondary"}>
                  {user.emailVerified ? "Verificado" : "No verificado"}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Creado:</span>
                <span>{new Date(user.createdAt).toLocaleDateString('es-ES')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Actualizado:</span>
                <span>{new Date(user.updatedAt).toLocaleDateString('es-ES')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">ID:</span>
                <code className="text-xs bg-muted px-1 rounded">{user.id}</code>
              </div>
            </div>
          </div>
          {user.image && (
            <div className="pt-4 border-t">
              <div className="flex items-center gap-4">
                <img
                  src={user.image}
                  alt={`Avatar de ${user.name}`}
                  className="w-16 h-16 rounded-full border"
                />
                <div>
                  <p className="font-medium">Imagen de perfil</p>
                  <p className="text-sm text-muted-foreground">
                    {user.image}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Sesión</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">ID de sesión:</span>
              <code className="ml-2 text-xs bg-muted px-1 rounded">{session.session.id}</code>
            </div>
            <div>
              <span className="font-medium">Expira:</span>
              <span className="ml-2">
                {new Date(session.session.expiresAt).toLocaleString('es-ES')}
              </span>
            </div>
            {session.session.ipAddress && (
              <div>
                <span className="font-medium">IP:</span>
                <code className="ml-2 text-xs bg-muted px-1 rounded">{session.session.ipAddress}</code>
              </div>
            )}
            {session.session.userAgent && (
              <div className="md:col-span-2">
                <span className="font-medium">User Agent:</span>
                <p className="text-xs text-muted-foreground mt-1 break-all">
                  {session.session.userAgent}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
