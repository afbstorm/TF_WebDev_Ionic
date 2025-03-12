import { Injectable } from '@angular/core';

//? Camera : Le module, la classe qui va nous fournir les méthodes pour intéragir
//? / manipuler la camera de l'appareil
//? CameraResultType : Un enum qui nous fournit des formats
//? / types de retour possibles de la photo
//? CameraSource : Un enum qui nous fournit les différentes sources possibles
//? pour la photo
//? Photo : Une interface qui va définir la structure de l'objet contenant la photo
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';

export interface IUserPhoto {
  filepath: string;
  webviewPath?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  public photos: IUserPhoto[] = [];

  constructor() {}

  // ! Utilisation de Camera de capacitor
  async addPhotoToGallery() {
    const picture = await Camera.getPhoto({
      // ! URI = Uniform Ressource Identifier
      // ? Une URI est un string qui va permettre d'identifier une ressource
      // ? Dans notre contexte l'uri (CameraResultType.Uri) signifie que
      // ? Camera va return une référence à la photo prise sous la forme d'une URI
      // ? à la place de données brutes
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const savedFile = await this.savePhoto(picture);

    this.photos.unshift(savedFile);
  }

  //! Permet de sauvegarder la photo sur le stockage local de l'application
  async savePhoto(photo: Photo) {
    //? Conversion de la photo en base64
    const base64 = await this.fetchBlob(photo);

    const fileName = Date.now() + '.jpeg';
    const file = await Filesystem.writeFile({
      path: fileName,
      data: base64,
      directory: Directory.Data,
    });

    return {
      filepath: fileName,
      webviewPath: photo.webPath,
    };
  }

  //! Récupération du blob et conversion en base64
  async fetchBlob(photo: Photo) {
    const result = await fetch(photo.webPath!);

    //? Un Blob est un " Binary Large Object "
    // ? Un blob représente des données binaires
    // ? On va généralement utiliser des blobs pour faciliter le traitement
    // ? de données multimédias type images, audio, ...
    // ? Principalement utilisé lors des requêtes HTTP pour alléger les requêtes
    // ? mais pas que.

    const blob = await result.blob();

    return (await this.convertBlobToBase64(blob)) as string;
  }

  //! Création d'une méthode utilitaire (qui pourrait avoir son propre fichier
  //! dans un dossier " utils " par exemple.
  //? Le base64 est un encodage qui permet de convertir des données binaires en un string
  //? en ASCII
  convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      //? On récupère le blob et on le transforme / convertit en base64
      //? "data:image/jpeg;base64,/5j/FEZKBVHBSDzef..."
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
}
