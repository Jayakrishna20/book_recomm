import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'highlight',
    standalone: true
})
export class HighlightPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }

    transform(text: string, search: string): SafeHtml {
        if (!search || !text) {
            return text;
        }
        const pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
        const regex = new RegExp(`(${pattern})`, 'gi');
        const replaced = text.replace(regex, '<span class="highlight">$1</span>');
        return this.sanitizer.bypassSecurityTrustHtml(replaced);
    }
}
