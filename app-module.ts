import { NgModule }      from '@angular/core';
import { ImageUploadModule } from "angular2-image-upload";

@NgModule({
    imports: [
        ImageUploadModule.forRoot()
    ]
})
export class AppModule { }
