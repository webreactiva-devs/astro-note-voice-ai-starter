import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Save, Edit3 } from "lucide-react";

interface TranscriptionModalProps {
  isOpen: boolean;
  transcription: string;
  onClose: () => void;
  onSave: (editedText: string) => void;
  isLoading?: boolean;
}

export function TranscriptionModal({ 
  isOpen, 
  transcription, 
  onClose, 
  onSave,
  isLoading = false 
}: TranscriptionModalProps) {
  const [editedText, setEditedText] = useState(transcription);
  const [isEditing, setIsEditing] = useState(false);

  React.useEffect(() => {
    setEditedText(transcription);
  }, [transcription]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(editedText);
  };

  const handleClose = () => {
    setIsEditing(false);
    setEditedText(transcription);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl">
            Transcripción del Audio
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Transcription text area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Texto transcrito:
              </label>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 className="mr-2 h-4 w-4" />
                  Editar
                </Button>
              )}
            </div>

            {isEditing ? (
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full min-h-[200px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Edita el texto transcrito aquí..."
                autoFocus
              />
            ) : (
              <div className="w-full min-h-[200px] p-3 border rounded-md bg-gray-50 whitespace-pre-wrap">
                {editedText || "No hay texto transcrito"}
              </div>
            )}
          </div>

          {/* Word count */}
          <div className="text-sm text-gray-500">
            Palabras: {editedText.trim().split(/\s+/).filter(word => word.length > 0).length}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4">
            {isEditing && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditedText(transcription);
                    setIsEditing(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Confirmar Edición
                </Button>
              </>
            )}
            
            {!isEditing && (
              <>
                <Button variant="outline" onClick={handleClose}>
                  Cerrar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading || !editedText.trim()}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Nota
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}