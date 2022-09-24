import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientModule, /* other http imports */ } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
export type ResponseType = 'arraybuffer' | 'blob' | 'json' | 'text';;
import 'rxjs/add/operator/map'
//const URL="http://localhost:3002"
const URL="http://54.214.162.22:3002"
const httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'my-auth-token',
      "Access-Control-Allow-Headers":"origin, content-type, accept",
      "Access-Control-Allow-Origin":"*",
    })
  };
  

@Injectable()
export class Services {

  constructor(private http: HttpClient) { }


    getPanel(id:string) {
        return this.http.get<any>(URL+'/panel/'+id,httpOptions)
            .map(resp => {
             
                //console.log("updatePlan",resp)
                return resp;
  
            });
      }

  

}