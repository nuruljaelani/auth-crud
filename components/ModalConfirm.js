import React from 'react'

const ModalConfirm = () => {
  return (
    <>
        <div className={modal ? "fixed z-10 inset-0 overflow-y-auto" : "hidden"}>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 bg-gray-600/80 transition-opacity"
            aria-hidden="true"
            onClick={setModal}
          />
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div className="inline-block p-4 align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full md:max-w-2xl">
            <div className="flex flex-col gap-8">
              <p className="font-semibold text-lg lg:text-xl">{title}</p>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ModalConfirm