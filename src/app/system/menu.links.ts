import { environment } from '../../environments/environment';

const MENU = [
  {
    link: '<none>',
    name: 'Administración',
    childrens: [
      {
        link: '/admin/audits',
        name: 'Registro de eventos',
        data: [{ resource: 'Audit' }],
      },
      /*       {
              link: '/admin/procesar_error',
              name: 'Procesar Error',
            }, */
      {
        link: '/admin/security_settings',
        name: 'Configuración de seguridad',
        data: [{ resource: 'SecuritySettings' }],
      },
      {
        link: '/admin/permisos',
        name: 'Permisos',
        data: [{ resource: 'Role' }],
      },
      {
        link: '/admin/roles',
        name: 'Roles',
        data: [{ resource: 'Role' }],
      },
      {
        link: '/admin/users',
        name: 'Usuarios',
        data: [{ resource: 'User' }],
      },
      {
        link: '/admin/notifications_config',
        name: 'Configuración de Notificaciones',
        data: [{ resource: 'NotificationConfig' }],
      },
    ],
  },
  {
    link: '<none>',
    name: 'Codificadores',
    childrens: [
      {
        link: '/nomencladores/provinces',
        name: 'Provincias',
        data: [{ resource: 'Provinces' }],
      },
      {
        link: '/nomencladores/municipalities',
        name: 'Municipios',
        data: [{ resource: 'Municipalities' }],
      },
      {
        link: '/nomencladores/motive',
        name: 'Motivo de rechazo',
        data: [{ resource: 'CauseRejection' }],
      },
    ],
  },
  {
    link: '<none>',
    name: 'Gestionar eFV',
    childrens: [
      /* {
        link: '/efv/list',
        name: 'Formas valiosas',
      }, */
      {
        link: '/efv/efv_buscar',
        name: 'Buscar eFV',
      },
      {
        link: '/efv/solicitudes',
        name: 'Solicitudes',
      },
      {
        link: '/efv/segmentos',
        name: 'Segmentos',
      },
      {
        link: '/efv/viajeros',
        name: 'Viajeros',
      },
    ],
  },
];

export const menu_links = MENU;
