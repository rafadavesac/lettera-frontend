import * as ImagePicker from 'expo-image-picker';
import { getImageFileError } from '../services/seller/uploadConfig';

// Extensão do arquivo enviado, a partir do tipo (o nome vem do tipo, não do
// arquivo original: no iPhone a foto "IMG.HEIC" é reencodada como JPEG).
const EXTENSION_BY_TYPE = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const TYPE_BY_EXTENSION = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };

// Tipo do arquivo: o que o seletor informa; senão, pela extensão da URI.
// Custo: O(n) no tamanho da URI.
function getMimeType(asset) {
  if (asset.mimeType) return asset.mimeType;
  const extension = asset.uri.split('?')[0].split('.').pop()?.toLowerCase();
  return TYPE_BY_EXTENSION[extension] ?? 'image/jpeg';
}

// Abre a galeria e devolve:
//   null            -> o usuário cancelou;
//   { error }       -> escolheu um arquivo que não serve (tipo ou tamanho);
//   { file }        -> { uri, name, type, size }, pronto para a prévia e o envio.
// Escolher da galeria não exige pedir permissão (a biblioteca cuida disso).
// quality 0.8 reduz o tamanho e converte fotos HEIC do iPhone em JPEG.
export async function pickProductImage() {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [2, 3], // proporção de capa de livro
    quality: 0.8,
  });
  if (result.canceled) return null;

  const asset = result.assets[0];
  const type = getMimeType(asset);
  const file = {
    uri: asset.uri,
    name: `produto-${Date.now()}.${EXTENSION_BY_TYPE[type] ?? 'jpg'}`,
    type,
    size: asset.fileSize ?? null,
  };

  const error = getImageFileError(file);
  return error ? { error } : { file };
}