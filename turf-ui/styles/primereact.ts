import { classNames } from "primereact/utils"

export const primereactPt = {
    radiobutton: {
        root: {
            className: classNames('relative inline-flex cursor-pointer select-none align-bottom', 'w-[20px] h-[20px]')
        },
        input: {
            className: classNames(
                'absolute appearance-none top-0 left-0 size-full p-0 m-0 opacity-0 z-10 outline-none cursor-pointer'
            )
        },
        box: ({ props }: any) => ({
            className: classNames(
                'relative flex justify-center items-center',
                'border-2 rounded-full',
                {
                    'border-gray-300 bg-light-tertiary': !props.checked,
                    'border-cyan-primary bg-cyan-primary': props.checked
                },
                {
                    'hover:border-cyan-primary focus:outline-none focus:outline-offset-0': !props.disabled,
                    'cursor-default opacity-60': props.disabled
                }
            )
        }),
        icon: ({ props }: any) => ({
            className: classNames(
                'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
                'w-[10px] h-[10px] rounded-full transition duration-200',
                {
                    'bg-light-tertiary': props.checked,
                    'bg-gray-300': !props.checked
                }
            )
        }),
        container: {
            className: classNames(
                'inline-flex items-center justify-center w-[24px] h-[24px] relative m-0'
            )
        }
    },
    checkbox: {
        box: ({ props, context }: any) => ({
            className: classNames(
                'flex items-center justify-center',
                'border-2 w-7 h-5 text-gray-600 rounded-md transition-colors duration-200',
                {
                    'border-gray-300 bg-light-tertiary dark:border-cyan-secondary dark:bg-gray-100': !context.checked,
                    'border-cyan-primary bg-cyan-primary dark:border-cyan-primary dark:bg-cyan-primary': context.checked
                },
                {
                    'hover:border-cyan-primary': !props.disabled,
                    'cursor-default opacity-60': props.disabled
                }
            )
        }),
    },
    autocomplete: {
        token: {
            className: classNames(
                'bg-cyan-primary text-light-tertiary font-secondary h-[2rem] rounded-full my-[.2rem] mx-0 px-[10px] max-w-[20rem]'
            )
        },
        tokenLabel: {
            className: classNames(
                'overflow-hidden whitespace-nowrap text-ellipsis'
            )
        },
        container: {
            className: classNames(
                'w-full rounded-lg shadow-none'
            )
        },
        panel: {
            className: classNames(
                'w-[45rem]'
            )
        },
        item: {
            className: classNames(
                'px-2 py-0 mx-0 my-2 hover:bg-cyan-tertiary'
            )
        },
        input: {
            className: classNames(
                'ps-2'
            )
        }
    },
    multiselect: {
        checkboxContainer: {
            className: classNames(
                'order-2'
            )
        },
        item: {
            className: classNames(
                'border border-gray-300'
            )
        },
    },
    inputtext: {
        root: {
            className: classNames(
                'text-dark-secondary !shadow-none border-gray-300 ps-2'
            )
        }
    },
    chips: {
        container: {
            className: classNames(
                'shadow-none'
            )
        },
        input: {
            className: classNames(
                'ps-1'
            )
        }
    },
    toast: {
        root: {
            className: classNames(
                'bg-light-tertiary opacity-100 rounded-lg'
            )
        },
        message: {
            className: classNames(
                'bg-light-tertiary opacity-100 rounded-lg m-0'
            )
        }
    },
    inputtextarea: {
        root: {
            className: classNames(
                '!ps-2'
            )
        }
    },
    fileupload: {
        buttonbar: {
            className: classNames(
                'ps-0 py-0 bg-light-tertiary'
            )
        },
        content: {
            className: classNames(
                'hidden'
            )
        }
    },
    password: {
        input: {
            className: classNames(
                'w-[100%]'
            )
        },
        showIcon: {
            className: classNames(
                'right-[0.5rem]'
            )
        },
        hideIcon: {
            className: classNames(
                'right-[0.5rem]'
            )
        },
        inputtext: {
            className: classNames(
                'w-[100%]'
            )
        },
        root: {
            className: classNames(
                'w-[100%]'
            )
        }
    },
    dropdown: {
        trigger: {
            className: classNames(
                'w-auto pe-2'
            )
        }
    }
}