import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";

export function SummaryCards() {
  const cards = [
    {
      title: "ຮັບສິນຄ້າທັງໝົດ",
      count: "156",
      icon: <Package className="w-6 h-6 text-blue-600" />,
      bgColor: "bg-blue-100",
      borderColor: "border-blue-600",
    },
    {
      title: "ລຳດັບຍັງເຫຼືອ",
      count: "23",
      icon: <Clock className="w-6 h-6 text-orange-500" />,
      bgColor: "bg-orange-100",
      borderColor: "border-orange-500",
    },
    {
      title: "ຮັບສຳເລັດແລ້ວ",
      count: "128",
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      bgColor: "bg-green-100",
      borderColor: "border-green-500",
    },
    {
      title: "ຮັບບາງສ່ວນ",
      count: "5",
      icon: <AlertCircle className="w-6 h-6 text-pink-500" />,
      bgColor: "bg-pink-200",
      borderColor: "border-pink-500",
    },
    {
      title: "ບໍ່ຍືນຍັນ",
      count: "5",
      icon: <XCircle className="w-6 h-6 text-red-500" />,
      bgColor: "bg-red-100",
      borderColor: "border-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card, index) => (
        <Card key={index} className="overflow-hidden border shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className={`p-3 rounded-full ${card.bgColor}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{card.count}</p>
              <p className="text-sm text-gray-500 font-medium">{card.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
