"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import classes from "./image-picker.module.css";

interface Props {
  label: string;
  name: string;
}
const ImagePicker = ({ label, name }: Props) => {
  const imageInput = useRef<HTMLInputElement>(null);

  const [pickedImage, setPickedImage] = useState<string | null>(null);

  const handleImagePick = () => {
    imageInput.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      /**
       * In order to display the picked image as preview,
       * we need to convert it into a data URL which is
       * simply a value that can be used as an input("src") fo an image element.
       */

      const fileReader = new FileReader();
      /**
       * "readAsDataURL" method doesn't return anything.
       * We get hold of that data URL that's being generated
       * by assigning a value(function) to the "onload" property.
       * This function will be triggered by the file reader once "readAsDataURL" is done.
       * We can access the generated data URL by accessing "fileReader.result".
       */
      fileReader.onload = () => {
        setPickedImage(fileReader.result as string);
      };

      fileReader.readAsDataURL(file);
    }
  };

  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {pickedImage ? (
            <Image src={pickedImage} alt="The image selected by the user." fill />
          ) : (
            <p>No image picked yet.</p>
          )}
        </div>
        <input
          id={name}
          name={name}
          onChange={handleImageChange}
          type="file"
          accept="image/png, image/jpeg"
          ref={imageInput}
          required
          className={classes.input}
        />
        <button
          onClick={handleImagePick}
          type="button"
          className={classes.button}
        >
          Pick an Image
        </button>
      </div>
    </div>
  );
};

export default ImagePicker;
