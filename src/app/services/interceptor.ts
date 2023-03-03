import { Injectable } from '@angular/core';
import { HttpHandler, HttpEvent, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { TransportService } from '../services/transport.service';

@Injectable()

export class Interceptor implements HttpInterceptor {

	constructor(private router: Router) { }
	

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const idToken = localStorage.getItem("accessToken");
		if (idToken) {
			const cloned = req.clone({
				headers: req.headers.set("Authorization", "Bearer " + idToken)
			});
			return next.handle(cloned).pipe(
				tap((event: HttpEvent<any>) => {
					if (event instanceof HttpResponse) {
						// Si queremos hacer algo con la respuesta, éste es el sitio.
						//console.log("event");
					}
				}, (err: any) => {
					if (err instanceof HttpErrorResponse) {
						//console.log("¡ERROR! -> " + err.status);
						switch (err.status) {
							case 401:
								localStorage.removeItem("accessToken");
								this.router.navigate(["login"]);
								break;
							case 404:
								console.log('Página no encontrada!');
								break;
							default:
								console.log('Error respuesta (' + err.status + '): ' + err.statusText);
								break;
						}
					}
				})
			);
		}
		else {
			//this.authService.getStatus();
			this.router.navigate(["login"]);
			return next.handle(req);
		}
	}
}