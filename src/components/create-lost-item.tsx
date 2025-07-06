import {  MapPinPlusIcon } from "lucide-react";
import { Button } from "./ui/button";

const CreateLostItem = () => {
  return (
    <Button
        className="fixed bg-green-600  bottom-6 right-6 z-50 flex items-center gap-2"
        variant="default"
        onClick={() => alert("Button clicked!")}
      >
        {/* <PlusIcon className="w-5 h-5" /> */}
        <MapPinPlusIcon className="w-5 h-5" />
      </Button>
  )
}

export default CreateLostItem;
