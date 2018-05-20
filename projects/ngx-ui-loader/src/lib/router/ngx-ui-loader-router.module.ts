import { NgModule, ModuleWithProviders, Inject, Optional } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

import { NgxUiLoaderService } from '../core/ngx-ui-loader.service';
import { NgxUiLoaderRouterConfig } from './ngx-ui-loader-router-config';
import { NGX_UI_LOADER_ROUTER_CONFIG_TOKEN } from './ngx-ui-loader-router-config.token';

@NgModule({})
export class NgxUiLoaderRouterModule {

  static forRoot(routerConfig: NgxUiLoaderRouterConfig): ModuleWithProviders {
    return {
      ngModule: NgxUiLoaderRouterModule,
      providers: [
        {
          provide: NGX_UI_LOADER_ROUTER_CONFIG_TOKEN,
          useValue: routerConfig
        }
      ]
    };
  }

  constructor(
    @Optional() @Inject(NGX_UI_LOADER_ROUTER_CONFIG_TOKEN) defaultConfig: NgxUiLoaderRouterConfig,
    router: Router,
    ngxUiLoaderService: NgxUiLoaderService) {

    let config: NgxUiLoaderRouterConfig = {
      showForeground: true
    };

    if (defaultConfig) {
      config = Object.assign(config, defaultConfig);
    }

    router.events
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          if (config.showForeground) {
            ngxUiLoaderService.start('$_router-loader');
          } else {
            ngxUiLoaderService.startBackground('$_router-loader');
          }
        }

        if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
          if (config.showForeground) {
            ngxUiLoaderService.stop('$_router-loader');
          } else {
            ngxUiLoaderService.stopBackground('$_router-loader');
          }
        }
      });
  }
}
