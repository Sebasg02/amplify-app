"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import { uploadData, getUrl } from 'aws-amplify/storage';
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from '@aws-amplify/ui-react';

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert('Por favor selecciona un archivo primero');
      return;
    }

    try {
      const result = await uploadData({
        key: 'uploads/${selectedFile.name}',
        data: selectedFile,
        options: {
          contentType: selectedFile.type,
        }
      }).result;

      console.log('Archivo subido exitosamente:', result);

      // Obtener la URL del archivo subido
      const { url } = await getUrl({
        key: 'uploads/${selectedFile.name}',
      });

      // Convertir la URL a string antes de guardarla en el estado
      setUploadedFileUrl(url.toString());
    } catch (error) {
      console.error('Error al subir el archivo:', error);
    }
  };

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <div>
            <h2>Subir Archivo</h2>
            <input
              type="file"
              onChange={handleFileSelect}
            />
            <button onClick={handleFileUpload}>
              Subir a S3
            </button>
            {uploadedFileUrl && (
              <p>
                Archivo subido: <a href={uploadedFileUrl} target="_blank" rel="noopener noreferrer">Ver archivo</a>
              </p>
            )}
          </div>

          <button onClick={signOut}>Cerrar sesión</button>
        </main>
      )}
    </Authenticator>
  );
}