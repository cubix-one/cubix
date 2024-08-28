const fileMap = new Map();
const importMap = new Map<string, string[]>();

export const setFileMap = (key: string, value: string): void => {
    fileMap.set(key.replace(/\\/g, '/'), value.replace(/\\/g, '/'));
};

export const getFileMap = (key?: string): string | Map<string, string> =>
    key ? fileMap.get(key) || '' : fileMap;

export const setImportMap = (key: string, value: string[]): void => {
    importMap.set(key.replace(/\\/g, '/'), value.map(v => v.replace(/\\/g, '/')));
};

export const getImportMap = (key?: string): string[] | Map<string, string[]> =>
    key ? importMap.get(key) || [] : importMap;

export type IAnnotationMap = {
    location: string;
    prefix: 'client' | 'server' | 'shared' | 'module';
};

export const annotationMap: { [key: string]: IAnnotationMap } = {
    'client_controller': {
        location: 'cubix/client/controllers',
        prefix: 'client'
    },
    'client_component': {
        location: 'cubix/client/components',
        prefix: 'client'
    },
    'client_module': {
        location: 'cubix/client/modules',
        prefix: 'module'
    },
    'ui_component': {
        location: 'cubix/client/ui',
        prefix: 'client'
    },
    'client_inputs': {
        location: 'cubix/client/inputs',
        prefix: 'client'
    },
    'event_listeners': {
        location: 'cubix/client/eventListeners',
        prefix: 'client'
    },
    'server_controller': {
        location: 'cubix/server/controllers',
        prefix: 'server'
    },
    'server_component': {
        location: 'cubix/server/components',
        prefix: 'server'
    },
    'server_module': {
        location: 'cubix/server/modules',
        prefix: 'module'
    },
    'event_handlers': {
        location: 'cubix/server/eventHandlers',
        prefix: 'server'
    },
    'shared_constants': {
        location: 'cubix/shared/constants',
        prefix: 'shared'
    },
    'shared_types': {
        location: 'cubix/shared/types',
        prefix: 'shared'
    },
    'shared_utils': {
        location: 'cubix/shared/utils',
        prefix: 'shared'
    },
    'shared_module': {
        location: 'cubix/shared/modules',
        prefix: 'module'
    }
};

