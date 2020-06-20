import { Component } from "@angular/core";
import { Post } from "../posts.model";
import { NgForm } from '@angular/forms';
import { PostService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent {
  newPost: any = 'NO CONTENT';
  enteredTitle = '';
  enteredContent = '';

  constructor(public postService:PostService){}

  onSubmit(form: NgForm) {
    if (form.invalid) return;
    this.postService.addPost(form.value.title, form.value.content);
    form.resetForm();
  }
}
