"use client";

import { useState } from "react";
import { generateClient } from "aws-amplify/data";
import { uploadData, getUrl } from 'aws-amplify/storage';
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from '@aws-amplify/ui-react';

import { FileUploader } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(outputs);

const client = generateClient<Schema>();


export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Por favor selecciona un archivo primero');
      return;
    }

    try {
      const result = await uploadData({
        path: 'uploads/sguisao',
        data: file
      });

      console.log('Archivo subido exitosamente:', result);

      // Obtener la URL del archivo subido
      const { url } = await getUrl({
        key: 'uploads/sguisao',
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

          <div style={{ marginTop: '20px' }}>
            <h2>Subir archivo</h2>
            <input type="file" onChange={handleFileSelect} />
            <button onClick={handleUpload}>Upload</button>
          </div>

          <button onClick={signOut} style={{ marginTop: '20px' }} >Cerrar sesión</button>

          {/* Mostrar URL del archivo subido si está disponible */}
          {uploadedFileUrl && (
            <div>
              <p>Archivo subido: <a href={uploadedFileUrl} target="_blank" rel="noopener noreferrer">{uploadedFileUrl}</a></p>
            </div>
          )}
        </main>
      )}
    </Authenticator>
  );
}