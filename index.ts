import * as Path from 'path';
import prettier from 'prettier';

interface IPath {
    path: string,
    content: string
};

interface INodeType {
    Directory?: string,
    File?: string
}

interface ITree {
    absolute?: string,
    type?: INodeType['Directory'] | INodeType['File'],
    children?: ITree | [],
    content?: string
}

const paths: IPath[] = [
    { path: "/var/a.txt", content: "aa" },
    { path: "/var/b/c.txt", content: "cc" },
    { path: "/var/d/e/f/g.txt", content: "gg" },
    { path: "/var/h/", content: "" },
    { path: "/var/h.h/", content: "" },
    { path: "/var///i//", content: "" },
    { path: "/var/b/a.txt", content: "aa" },
    { path: "/var/b/b.txt", content: "bb" },
];

let tree: ITree = {};

const prepareTree = (content: string, steps: string[]) => {
    let current: any;
    for (let i = 0; i < steps.length; i++) {
        const isFile: boolean = steps[i].indexOf('.') !== -1;
        const type = isFile ? 'Type.File' : 'Type.Directory';
        if (!i) {
            if (!tree.children) {
                tree = { absolute: '/', type, children: [] };
            }
            current = tree.children;
        } else if (i === steps.length - 1) {
            if (isFile) {
                current.push({ absolute: `/${steps[i]}/`, type, content })
            } else {
                current.push({ absolute: `/${steps[i]}/`, type })
            }
        } else {
            current.push({ absolute: `/${steps[i]}/`, type, children: [] })
            current = current[current.length - 1].children;
        }
    }
}

for (let i = 0; i < paths.length; i++) {
    const steps = Path.resolve(paths[i].path).split('/');
    prepareTree(paths[i].content, steps);
}
console.log(prettier.format(JSON.stringify(tree),{ semi: false, parser: "json" }));


/*
{
    "absolute": "/",
    "type": "Type.Directory",
    "children": [
        {
            "absolute": "/var/",
            "type": "Type.Directory",
            "children": [
                {
                    "absolute": "/a.txt/",
                    "type": "Type.File",
                    "content": "aa"
                }
            ]
        },
        {
            "absolute": "/var/",
            "type": "Type.Directory",
            "children": [
                {
                    "absolute": "/b/",
                    "type": "Type.Directory",
                    "children": [
                        {
                            "absolute": "/c.txt/",
                            "type": "Type.File",
                            "content": "cc"
                        }
                    ]
                }
            ]
        },
        {
            "absolute": "/var/",
            "type": "Type.Directory",
            "children": [
                {
                    "absolute": "/d/",
                    "type": "Type.Directory",
                    "children": [
                        {
                            "absolute": "/e/",
                            "type": "Type.Directory",
                            "children": [
                                {
                                    "absolute": "/f/",
                                    "type": "Type.Directory",
                                    "children": [
                                        {
                                            "absolute": "/g.txt/",
                                            "type": "Type.File",
                                            "content": "gg"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "absolute": "/var/",
            "type": "Type.Directory",
            "children": [
                {
                    "absolute": "/h/",
                    "type": "Type.Directory"
                }
            ]
        },
        {
            "absolute": "/var/",
            "type": "Type.Directory",
            "children": [
                {
                    "absolute": "/h.h/",
                    "type": "Type.File",
                    "content": ""
                }
            ]
        },
        {
            "absolute": "/var/",
            "type": "Type.Directory",
            "children": [
                {
                    "absolute": "/i/",
                    "type": "Type.Directory"
                }
            ]
        },
        {
            "absolute": "/var/",
            "type": "Type.Directory",
            "children": [
                {
                    "absolute": "/b/",
                    "type": "Type.Directory",
                    "children": [
                        {
                            "absolute": "/a.txt/",
                            "type": "Type.File",
                            "content": "aa"
                        }
                    ]
                }
            ]
        },
        {
            "absolute": "/var/",
            "type": "Type.Directory",
            "children": [
                {
                    "absolute": "/b/",
                    "type": "Type.Directory",
                    "children": [
                        {
                            "absolute": "/b.txt/",
                            "type": "Type.File",
                            "content": "bb"
                        }
                    ]
                }
            ]
        }
    ]
}
*/