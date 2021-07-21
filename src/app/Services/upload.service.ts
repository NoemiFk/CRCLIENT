import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor() { }
  uploadFile(file) {
    return new Promise((resolve, reject) => {
      const contentType = file.type;
      const bucket = new S3(
            {
                accessKeyId: 'AKIAYPH7JDXZ4F33CKFS',
                secretAccessKey: '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',
                region: 'us-west-2'
            }
        );
      const params = {
          Bucket: 'documents-cr',
          Key:  file.name,
          Body: file,
          ACL: 'public-read',
          ContentType: contentType
      };
      bucket.upload(params, function (err, data) {
          if (err) {
              console.log('There was an error uploading your file: ', err);
              reject(err)
          }
          console.log('Successfully uploaded file.', data.Location);
          resolve( data.Location)
      });
    })
  }
}
