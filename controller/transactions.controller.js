const { ResponseTemplate } = require('../helper/template.helper')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function Transfer(req, res) {
    const {
        source_account,
        destination_account,
        amount,
    } = req.body

    try {
        const source_bank = await prisma.bank_Accounts.findUnique({
            where: {
                id: Number(source_account)
            }
        })
        
        if (!source_bank) {
            res.json(ResponseTemplate(source_bank, 'error', "Akun bank pengirim tidak ditemukan", 404))
            return
        }
        
        const destination_bank = await prisma.bank_Accounts.findUnique({
            where: {
                id: Number(destination_account)
            }
        })

        if (!destination_bank) {
            res.json(ResponseTemplate(destination_bank, 'error', "Akun bank penerima tidak ditemukan", 404))
            return
        }
        
        if (source_account === destination_account) {
            res.json(ResponseTemplate(null, 'error', "Akun bank penerima harus berbeda dengan akun pengirim", 404))
            return
        }

        if (source_bank?.balance < amount) {
            res.json(ResponseTemplate(null, 'error', "Saldo tidak mencukupi", 404))
            return
        }

        const updateSourceBank = await prisma.bank_Accounts.update({
            where: {
                id: Number(source_account)
            },
            data: {
                amount: source_bank?.balance - amount,
            }
        })

        const updateDestinationBank = await prisma.bank_Accounts.update({
            where: {
                id: Number(destination_account)
            },
            data: {
                amount: destination_bank?.balance + amount,
            }
        })

        const transactions = await prisma.transactions.create({
            data: {
                user_id,
                bank_name,
                bank_account_number,
                balance,
            },
        });

        let resp = ResponseTemplate(transactions, 'success', null, 200)
        res.json(resp)
        return

    } catch (error) {
        let resp = ResponseTemplate(null, 'internal server error', error, 500)
        res.json(resp)
        return
    }
}

async function Get(req, res) {
    const { page, perPage } = req.query;

    // Konversi halaman dan data per halaman ke tipe angka
    const pageNumber = parseInt(page) || 1;
    const itemsPerPage = parseInt(perPage) || 10;

    // Menghitung jumlah data yang akan dilewati (skip)
    const skip = (pageNumber - 1) * itemsPerPage;

    try {
        const totalData = await prisma.transactions.count();

        const transactions = await prisma.transactions.findMany({
            skip: skip,
            take: itemsPerPage,
        });

        const meta = {
            total: totalData,
            limit: itemsPerPage,
            page: pageNumber,
        };

        let resp = ResponseTemplate(transactions, 'success', null, 200, meta);
        res.json(resp);
    } catch (error) {
        let resp = ResponseTemplate(null, 'internal server error', error, 500);
        res.json(resp);
    }
}


module.exports = {
    Transfer,
    Get,
}